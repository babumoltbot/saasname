import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TIERS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (userId) {
      await db
        .update(users)
        .set({
          tier: "pro",
          generationsLimit: TIERS.pro.generationsLimit,
          namesPerGeneration: TIERS.pro.namesPerGeneration,
          stripeCustomerId: session.customer as string | null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }
  }

  return NextResponse.json({ received: true });
}
