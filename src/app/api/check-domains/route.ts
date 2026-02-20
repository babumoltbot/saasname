import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, domainChecks } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { domainChecker } from "@/lib/services/domain-checker";
import { rateLimit } from "@/lib/rate-limit";
import { TIERS } from "@/lib/constants";

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

// POST /api/check-domains  { name, tld }
// Checks a single domain via WhoisXML API and saves result to cache
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
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { name, tld } = await req.json();
  if (!name || typeof name !== "string" || !tld || typeof tld !== "string") {
    return NextResponse.json({ error: "name and tld are required" }, { status: 400 });
  }

  const tier = TIERS[dbUser.tier as keyof typeof TIERS];
  if (!(tier.tlds as readonly string[]).includes(tld)) {
    return NextResponse.json({ error: "TLD not available on your tier" }, { status: 403 });
  }

  const [result] = await domainChecker.check(name, [tld]);
  const now = new Date();

  // Save/update cache
  await db
    .insert(domainChecks)
    .values({ domain: result.domain, available: result.available, checkedAt: now })
    .onConflictDoUpdate({
      target: domainChecks.domain,
      set: { available: result.available, checkedAt: now },
    });

  return NextResponse.json({ domain: { ...result, checkedAt: now } });
}
