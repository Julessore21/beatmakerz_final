import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const logEvent = (message: string, payload?: unknown) => {
  if (payload === undefined) {
    console.log(`[stripe:webhook] ${message}`);
  } else {
    console.log(`[stripe:webhook] ${message}`, payload);
  }
};

export async function POST(req: Request) {
  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      if (!signature) {
        return new NextResponse("Missing Stripe signature header.", { status: 400 });
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logEvent("Webhook signature verification failed", message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.trial_will_end":
      case "customer.subscription.deleted":
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logEvent(`Subscription event: ${event.type}`, {
          id: subscription.id,
          status: subscription.status,
        });
        break;
      }
      case "entitlements.active_entitlement_summary.updated": {
        logEvent("Active entitlement summary updated", event.data.object);
        break;
      }
      default: {
        logEvent(`Unhandled event type: ${event.type}`);
      }
    }
  } catch (error) {
    logEvent("Error handling webhook event", error);
    return new NextResponse("Webhook handler error.", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
