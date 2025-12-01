import { NextResponse } from "next/server";
import { getAppBaseUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

interface PortalRequestBody {
  sessionId?: string;
  customerId?: string;
}

export async function POST(req: Request) {
  let body: PortalRequestBody;
  try {
    body = (await req.json()) as PortalRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  let { sessionId, customerId } = body ?? {};
  if (!sessionId && !customerId) {
    return NextResponse.json(
      { error: "Provide either a checkout session_id or customerId." },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();

    if (!customerId && sessionId) {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      const sessionCustomer = checkoutSession.customer;
      if (typeof sessionCustomer === "string") {
        customerId = sessionCustomer;
      } else if (sessionCustomer && "id" in sessionCustomer) {
        customerId = sessionCustomer.id;
      }
    }

    if (!customerId) {
      return NextResponse.json({ error: "Unable to determine customer." }, { status: 400 });
    }

    const origin = getAppBaseUrl(req.headers.get("origin") ?? undefined);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/web/abonnements`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe portal session error", error);
    return NextResponse.json({ error: "Unable to create portal session." }, { status: 500 });
  }
}
