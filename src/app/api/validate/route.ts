import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, validations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { domainChecker } from "@/lib/services/domain-checker";
import { socialChecker } from "@/lib/services/social-checker";
import { trademarkScreener } from "@/lib/services/trademark-screener";
import { competitorAnalyzer } from "@/lib/services/competitor-analyzer";
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

  // Rate limit: 10 per minute
  if (!rateLimit(`validate:${dbUser.id}`, 10)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();
  const { name, generationId, industry } = body;

  if (!name || !generationId) {
    return NextResponse.json({ error: "Name and generationId required" }, { status: 400 });
  }

  const tier = TIERS[dbUser.tier as keyof typeof TIERS];

  // Run checks in parallel based on tier
  const [domains, socials, trademark, competitors] = await Promise.all([
    domainChecker.check(name, [...tier.tlds]),
    tier.features.socialHandles
      ? socialChecker.check(name)
      : Promise.resolve(null),
    tier.features.trademarkScreening
      ? trademarkScreener.screen(name, industry || "technology")
      : Promise.resolve(null),
    tier.features.competitorAnalysis
      ? competitorAnalyzer.analyze(name, industry || "technology")
      : Promise.resolve(null),
  ]);

  // Save validation
  const [validation] = await db
    .insert(validations)
    .values({
      generationId,
      name,
      domains,
      socials,
      trademark,
      competitors,
    })
    .returning();

  return NextResponse.json({
    id: validation.id,
    name,
    domains,
    socials,
    trademark,
    competitors,
    tierLocked: {
      socialHandles: !tier.features.socialHandles,
      trademarkScreening: !tier.features.trademarkScreening,
      competitorAnalysis: !tier.features.competitorAnalysis,
    },
  });
}
