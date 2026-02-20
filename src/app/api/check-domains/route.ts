import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { domainChecker } from "@/lib/services/domain-checker";
import { rateLimit } from "@/lib/rate-limit";
import { TIERS } from "@/lib/constants";

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

  // Validate tld is in user's tier
  const tier = TIERS[dbUser.tier as keyof typeof TIERS];
  if (!(tier.tlds as readonly string[]).includes(tld)) {
    return NextResponse.json({ error: "TLD not available on your tier" }, { status: 403 });
  }

  const [result] = await domainChecker.check(name, [tld]);
  return NextResponse.json({ domain: result });
}
