import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nameGenerator } from "@/lib/services/name-generator";
import { rateLimit } from "@/lib/rate-limit";

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

  if (!rateLimit(`questions:${dbUser.id}`, 10)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
  }

  const body = await req.json();
  const idea = body.idea?.trim();

  if (!idea || idea.length < 10) {
    return NextResponse.json({ error: "Please describe your idea in at least 10 characters" }, { status: 400 });
  }

  const questions = await nameGenerator.generateQuestions(idea);

  return NextResponse.json({ questions });
}
