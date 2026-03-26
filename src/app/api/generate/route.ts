import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, generations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nameGenerator } from "@/lib/services/name-generator";
import { brandScorer } from "@/lib/services/brand-scorer";
import { rateLimit } from "@/lib/rate-limit";
import { TIERS } from "@/lib/constants";
import { audit } from "@/lib/audit-log";
import { getProvider } from "@/lib/ai-client";

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

  // Rate limit: 5 per minute
  if (!rateLimit(`generate:${dbUser.id}`, 5)) {
    audit("rate_limited", { user: session.user.email, tier: dbUser.tier, meta: { action: "generate" } });
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  // Require Pro tier
  if (dbUser.tier !== "pro") {
    return NextResponse.json({
      error: "Pro plan required",
      upgrade: true,
    }, { status: 403 });
  }

  // Check generation limit
  if (dbUser.generationsUsed >= dbUser.generationsLimit) {
    return NextResponse.json({
      error: "Generation limit reached",
      upgrade: false,
    }, { status: 403 });
  }

  const body = await req.json();
  const idea = body.idea?.trim();
  const clarifications = body.clarifications;
  const excludeNames: string[] = body.excludeNames ?? [];

  if (!idea || idea.length < 10) {
    return NextResponse.json({ error: "Please describe your idea in at least 10 characters" }, { status: 400 });
  }

  const count = TIERS.pro.namesPerGeneration;

  // Generate names, excluding any previously generated ones
  const names = await nameGenerator.generate(idea, count, clarifications, excludeNames.length > 0 ? excludeNames : undefined);

  // Score each name
  const namesWithScores = await Promise.all(
    names.map(async (n) => {
      const score = await brandScorer.score(n.name, idea);
      return { ...n, brandScore: score };
    })
  );

  // Save generation
  const aiProvider = getProvider();
  const [generation] = await db
    .insert(generations)
    .values({
      userId: dbUser.id,
      ideaText: idea,
      names: namesWithScores,
      clarifications: clarifications?.length ? clarifications : null,
      aiProvider,
    })
    .returning();

  // Increment usage
  await db
    .update(users)
    .set({
      generationsUsed: dbUser.generationsUsed + 1,
      updatedAt: new Date(),
    })
    .where(eq(users.id, dbUser.id));

  audit("generate", {
    user: session.user.email,
    tier: dbUser.tier,
    meta: { generationId: generation.id, nameCount: namesWithScores.length, idea: idea.slice(0, 100), aiProvider },
  });

  return NextResponse.json({
    generationId: generation.id,
    names: namesWithScores,
    generationsRemaining: dbUser.generationsLimit - dbUser.generationsUsed - 1,
  });
}
