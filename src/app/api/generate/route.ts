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
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  // Check generation limit
  if (dbUser.generationsUsed >= dbUser.generationsLimit) {
    return NextResponse.json({
      error: "Generation limit reached",
      upgrade: dbUser.tier === "free",
    }, { status: 403 });
  }

  const body = await req.json();
  const idea = body.idea?.trim();

  if (!idea || idea.length < 10) {
    return NextResponse.json({ error: "Please describe your idea in at least 10 characters" }, { status: 400 });
  }

  const tier = TIERS[dbUser.tier as keyof typeof TIERS];
  const count = tier.namesPerGeneration;

  // Generate names
  const names = await nameGenerator.generate(idea, count);

  // Score each name
  const namesWithScores = await Promise.all(
    names.map(async (n) => {
      const score = await brandScorer.score(n.name, idea);
      return { ...n, brandScore: score };
    })
  );

  // Save generation
  const [generation] = await db
    .insert(generations)
    .values({
      userId: dbUser.id,
      ideaText: idea,
      names: namesWithScores,
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

  return NextResponse.json({
    generationId: generation.id,
    names: namesWithScores,
    generationsRemaining: dbUser.generationsLimit - dbUser.generationsUsed - 1,
  });
}
