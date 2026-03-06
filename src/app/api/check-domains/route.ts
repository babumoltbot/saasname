import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, domainChecks } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { domainChecker } from "@/lib/services/domain-checker";
import { rateLimit } from "@/lib/rate-limit";
import { TIERS } from "@/lib/constants";
import { audit } from "@/lib/audit-log";

// GET /api/check-domains?name=CalendarIQ
// Returns cached results for all TLDs the user's tier allows
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const name = req.nextUrl.searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const tier = TIERS[dbUser.tier as keyof typeof TIERS];
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const domains = tier.tlds.map((tld) => slug + tld);

  const cached = await db
    .select()
    .from(domainChecks)
    .where(inArray(domainChecks.domain, domains));

  return NextResponse.json({ cached });
}

// POST /api/check-domains  { name, tlds: [".com", ".net", ...] }
// Checks multiple domains in parallel and saves results to cache
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!rateLimit(`check-domains:${dbUser.id}`, 20)) {
    audit("rate_limited", { user: session.user.email, tier: dbUser.tier, meta: { action: "check_domains" } });
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();
  const name = body.name;
  // Support both { tld } (single) and { tlds } (batch)
  const tlds: string[] = body.tlds ?? (body.tld ? [body.tld] : []);

  if (!name || typeof name !== "string" || tlds.length === 0) {
    return NextResponse.json({ error: "name and tlds are required" }, { status: 400 });
  }

  const tier = TIERS[dbUser.tier as keyof typeof TIERS];
  const allowed = tier.tlds as readonly string[];
  const invalid = tlds.filter((t) => !allowed.includes(t));
  if (invalid.length > 0) {
    return NextResponse.json({ error: `TLDs not available on your tier: ${invalid.join(", ")}` }, { status: 403 });
  }

  const results = await domainChecker.check(name, tlds);
  const now = new Date();

  // Save/update cache for all results
  for (const result of results) {
    await db
      .insert(domainChecks)
      .values({ domain: result.domain, available: result.available, checkedAt: now })
      .onConflictDoUpdate({
        target: domainChecks.domain,
        set: { available: result.available, checkedAt: now },
      });
  }

  audit("check_domains", {
    user: session.user.email,
    tier: dbUser.tier,
    meta: { name, tlds, resultCount: results.length },
  });

  return NextResponse.json({
    domains: results.map((r) => ({ ...r, checkedAt: now })),
  });
}
