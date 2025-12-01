import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id query parameter." },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email ?? null,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error("Stripe session status error", error);
    return NextResponse.json(
      { error: "Unable to retrieve checkout session status." },
      { status: 500 }
    );
  }
}
