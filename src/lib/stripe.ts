import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

export async function createCheckoutSession(
  userEmail: string,
  userId: string
): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: userEmail,
    metadata: { userId },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "SaaSName Pro",
            description:
              "50 generations, all TLDs, social handles, trademark screening, competitor analysis",
          },
          unit_amount: 2900, // $29.00
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/generate?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/generate`,
  });

  return session.url!;
}
