import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, featureInterest } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { createCheckoutSession } from "@/lib/stripe";
import { audit } from "@/lib/audit-log";

export async function POST() {
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

  if (dbUser.tier === "pro") {
    return NextResponse.json({ error: "Already on Pro" }, { status: 400 });
  }

  // Stripe not configured
  if (!process.env.STRIPE_SECRET_KEY) {
    const bypassEnabled = process.env.STRIPE_BYPASS_ENABLED !== "false";

    if (bypassEnabled) {
      // Check if we already sent a Slack alert for this user
      const alreadyRecorded = await db.query.featureInterest.findFirst({
        where: and(
          eq(featureInterest.userId, dbUser.id),
          eq(featureInterest.feature, "stripe_bypass"),
        ),
      });

      if (!alreadyRecorded) {
        await db.insert(featureInterest).values({
          userId: dbUser.id,
          feature: "stripe_bypass",
        });

        audit("stripe_bypass", {
          user: session.user.email,
          tier: dbUser.tier,
          meta: { message: "User tried to pay but Stripe is not configured" },
        });
      }

      return NextResponse.json({ stripeUnavailable: true });
    }

    // Bypass disabled — hard error
    return NextResponse.json(
      { error: "Payments are temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const url = await createCheckoutSession(dbUser.email, dbUser.id);

  audit("checkout_created", { user: session.user.email, tier: dbUser.tier });

  return NextResponse.json({ url });
}
