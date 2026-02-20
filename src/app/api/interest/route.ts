import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, featureInterest } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { feature } = await req.json();
  if (!feature || typeof feature !== "string") {
    return NextResponse.json({ error: "feature is required" }, { status: 400 });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Upsert: one record per user per feature to avoid spam
  const existing = await db.query.featureInterest.findFirst({
    where: (t, { and }) => and(eq(t.userId, dbUser.id), eq(t.feature, feature)),
  });

  if (!existing) {
    await db.insert(featureInterest).values({
      userId: dbUser.id,
      feature,
    });
  }

  return NextResponse.json({ ok: true });
}
