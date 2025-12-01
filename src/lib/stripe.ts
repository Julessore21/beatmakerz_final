import Stripe from "stripe";

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2025-09-30.clover";

let stripeClient: Stripe | null = null;

export const getStripe = (): Stripe => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Stripe secret key is not configured. Set STRIPE_SECRET_KEY in your environment.');
  }
  if (stripeClient) {
    return stripeClient;
  }
  stripeClient = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
  return stripeClient;
};

export const getAppBaseUrl = (fallback?: string): string => {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    fallback ||
    'http://localhost:3000'
  );
};
