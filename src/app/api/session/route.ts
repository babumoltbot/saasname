import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ authenticated: false });
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!dbUser) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      image: dbUser.image,
      tier: dbUser.tier,
      generationsUsed: dbUser.generationsUsed,
      generationsLimit: dbUser.generationsLimit,
      generationsRemaining: dbUser.generationsLimit - dbUser.generationsUsed,
      namesPerGeneration: dbUser.namesPerGeneration,
    },
  });
}
