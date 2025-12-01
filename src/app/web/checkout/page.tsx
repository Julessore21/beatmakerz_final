"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/services/api-client";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, CreditCard, Loader2, ArrowLeft } from "lucide-react";

type CartItem = {
  _id?: string;
  beatId: string;
  beat?: { title?: string; artist?: string };
  licenseTypeId?: string;
  licenseType?: { code?: string };
  qty?: number;
  unitPriceSnapshotCents?: number;
};

type CartResponse = {
  items: CartItem[];
  totalCents: number;
  currency?: string;
};

const fmtPrice = (cents?: number, currency = "EUR") => (cents != null ? `${(cents / 100).toFixed(2)} ${currency}` : "--");

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet<CartResponse>("/me/cart");
        setCart(data);
      } catch (e: any) {
        setError("Impossible de charger le panier");
      }
    };
    load();
  }, []);

  const hasItems = (cart?.items?.length ?? 0) > 0;

  const totals = useMemo(() => {
    const subtotal = cart?.totalCents ?? 0;
    const tax = Math.round(subtotal * 0.2);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiPost<{ url: string }>("/checkout/session", {
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/web/checkout/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/web/checkout/cancel`,
      });
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de redirection manquante");
      }
    } catch (e: any) {
      setError("Impossible de créer la session de paiement");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] bg-[#0A0A12] text-white">
      <main className="mx-auto w-full max-w-5xl px-4 py-16">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => router.push("/web/panier")} className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Retour au panier
          </button>
          {user ? <span className="text-sm text-zinc-400">Connecté en tant que {typeof user === "string" ? user : user?.email}</span> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h1 className="text-xl font-semibold">Récapitulatif</h1>
            {!hasItems && <p className="mt-3 text-sm text-zinc-400">Votre panier est vide.</p>}
            <div className="mt-4 space-y-3">
              {cart?.items?.map((item) => {
                const title = item.beat?.title || `Beat ${item.beatId}`;
                const artist = item.beat?.artist || "";
                const license = item.licenseType?.code || item.licenseTypeId || "Licence";
                return (
                  <div key={item._id || `${item.beatId}-${license}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="text-xs text-zinc-400">
                          {artist} • {license}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">{fmtPrice(item.unitPriceSnapshotCents, cart?.currency)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold">Paiement Stripe</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-200">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{fmtPrice(totals.subtotal, cart?.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA (20%)</span>
                <span>{fmtPrice(totals.tax, cart?.currency)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{fmtPrice(totals.total, cart?.currency)}</span>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
            <button
              disabled={!hasItems || loading}
              onClick={handleCheckout}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Payer avec Stripe
            </button>
            <p className="mt-3 text-xs text-zinc-400">
              Vous serez redirigé vers une page sécurisée Stripe. Aucun paiement n’est prélevé tant que vous n’avez pas confirmé.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
