import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan } = body as { plan: "PRO" | "PREMIUM" };

    if (!plan || !["PRO", "PREMIUM"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be PRO or PREMIUM." },
        { status: 400 }
      );
    }

    const userId = session.user.id as string;
    const userEmail = session.user.email as string;

    // Fetch existing stripeCustomerId if user already has one
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, plan: true },
    });

    if (user?.plan === "PRO" || user?.plan === "PREMIUM") {
      return NextResponse.json(
        { error: `Already on ${user.plan} plan` },
        { status: 400 }
      );
    }

    // Create or reuse Stripe customer
    let customerId = user?.stripeCustomerId ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      customerId = customer.id;

      // Persist immediately so webhook can look up by customerId
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const priceId =
      plan === "PREMIUM"
        ? process.env.STRIPE_PREMIUM_PRICE_ID
        : process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        {
          error: `STRIPE_${plan}_PRICE_ID not configured`,
        },
        { status: 500 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseUrl}/settings?upgraded=true`,
      cancel_url: `${baseUrl}/pricing?cancelled=true`,
      metadata: { userId, plan },
    });

    if (!checkoutSession.url) {
      console.error("Stripe session created but no URL returned:", checkoutSession);
      return NextResponse.json(
        { error: "Failed to create checkout session (no URL)" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("POST /api/stripe/checkout error:", error instanceof Error ? error.message : String(error));
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: `Checkout error: ${message}` },
      { status: 500 }
    );
  }
}
