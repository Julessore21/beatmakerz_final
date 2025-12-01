"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const fallbackBeatPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_BEAT;
const stripePromise = publishableKey
  ? loadStripe(publishableKey)
  : Promise.resolve(null);

const getPositiveInteger = (value: string | null, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? undefined;
  const lookupKey = searchParams.get("lookupKey") ?? undefined;
  const priceIdFromQuery = searchParams.get("priceId") ?? undefined;
  const modeParam = searchParams.get("mode");
  const mode = modeParam === "subscription" ? "subscription" : "payment";
  const quantity = getPositiveInteger(searchParams.get("quantity"), 1);
  const [error, setError] = useState<string | null>(null);

  const priceId = priceIdFromQuery ?? (!lookupKey ? fallbackBeatPriceId ?? undefined : undefined);

  const fetchClientSecret = useCallback(async () => {
    setError(null);

    const response = await fetch("/api/stripe/create-embedded-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, lookupKey, priceId, mode, quantity }),
    });

    const payload = (await response.json()) as {
      clientSecret?: string;
      error?: string;
    };

    if (!response.ok || !payload.clientSecret) {
      const message = payload.error || "Impossible de demarrer le paiement.";
      setError(message);
      throw new Error(message);
    }

    return payload.clientSecret;
  }, [mode, priceId, lookupKey, sessionId, quantity]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);

  if (!publishableKey) {
    return (
      <div className="page-section">
        <div className="card max-w-xl mx-auto p-6 text-center text-sm text-red-300 bg-red-500/10 border border-red-400/40">
          La cle Stripe publishable (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) est manquante.
          Ajoute-la a `.env.local`, redemarre le serveur puis recharge la page.
        </div>
      </div>
    );
  }

  const isUsingFallbackBeatPrice = !lookupKey && !priceIdFromQuery && Boolean(fallbackBeatPriceId);

  return (
    <div className="page-section">
      <div className="card max-w-2xl mx-auto w-full overflow-hidden border border-white/10 bg-black/40">
        {error && (
          <div className="bg-rose-500/10 border border-rose-400/40 text-rose-100 text-sm px-4 py-3">
            {error}
          </div>
        )}
        {!priceId && !lookupKey && !error && (
          <div className="bg-amber-500/10 border-b border-amber-400/30 px-4 py-3 text-xs text-amber-100">
            Fournis un `priceId` ou un `lookupKey` dans l&apos;URL (ex: `/checkout?priceId=...`).
            {fallbackBeatPriceId
              ? " La valeur NEXT_PUBLIC_STRIPE_PRICE_BEAT est definie mais n'a pas pu etre utilisee."
              : " Definis NEXT_PUBLIC_STRIPE_PRICE_BEAT dans .env.local pour un tarif par defaut."}
          </div>
        )}
        {isUsingFallbackBeatPrice && (
          <div className="bg-emerald-500/5 border-b border-emerald-400/30 px-4 py-3 text-xs text-emerald-200">
            Utilisation du tarif catalogue par defaut pour ce paiement.
          </div>
        )}
        {priceId && (
          <div className="bg-white/5 border-b border-white/10 px-4 py-3 text-xs text-neutral-300 flex flex-wrap justify-between gap-2">
            <span>Tarif Stripe : {priceId}</span>
            <span>Quantite : {quantity}</span>
            <span>Mode : {mode === "subscription" ? "Abonnement" : "Paiement unique"}</span>
          </div>
        )}
        <div className="p-4 space-y-4">
          {lookupKey && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-neutral-200">
              Lookup key Stripe : {lookupKey}
            </div>
          )}
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}


