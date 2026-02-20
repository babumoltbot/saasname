import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, generations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
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

  const rows = await db
    .select()
    .from(generations)
    .where(eq(generations.userId, dbUser.id))
    .orderBy(desc(generations.createdAt));

  return NextResponse.json(rows);
}
