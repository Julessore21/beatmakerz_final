/**
 * Page de checkout
 * Utilise le backend pour créer une session Stripe sécurisée
 */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth.service";
import { useAuth } from "@/context/AuthContext";
import { CreditCard, Loader2, ArrowLeft } from "lucide-react";
import AuthRequiredModal from "@/components/AuthRequiredModal";

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
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          setError("Vous devez être connecté pour accéder au checkout");
          return;
        }

        const response = await AuthService.authenticatedFetch("/me/cart");

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await response.json();
        setCart(data);
      } catch (e: any) {
        setError("Impossible de charger le panier");
        console.error("Failed to load cart:", e);
      }
    };
    load();
  }, []);

  const hasItems = (cart?.items?.length ?? 0) > 0;

  // ✅ Le total est calculé côté serveur (cart.totalCents)
  // Le backend gère déjà les taxes dans le prix
  const totalCents = cart?.totalCents ?? 0;

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!hasItems) {
      setError("Votre panier est vide");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Appeler le backend pour créer une session Stripe
      const response = await AuthService.authenticatedFetch("/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create checkout session");
      }

      const data = await response.json();

      if (data?.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.url;
        return;
      }

      throw new Error("URL de redirection manquante");
    } catch (e: any) {
      console.error("Checkout error:", e);
      setError(e.message || "Impossible de créer la session de paiement");
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
          {user ? <span className="text-sm text-zinc-400">Connecté en tant que {typeof user === "string" ? user : (user as any)?.email}</span> : null}
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
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{fmtPrice(totalCents, cart?.currency)}</span>
              </div>
              <p className="text-xs text-zinc-500">
                TVA incluse
              </p>
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
      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          router.push("/web/profil?mode=login");
        }}
        message="Connecte-toi pour finaliser ton paiement."
      />
    </div>
  );
}
