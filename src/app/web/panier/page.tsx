"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShieldCheck, CreditCard, PackageSearch, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiPost } from "@/lib/services/api-client";
import AuthRequiredModal from "@/components/AuthRequiredModal";

const SummaryRow = ({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex items-center justify-between text-sm text-zinc-200">
    <span className="text-zinc-400">{label}</span>
    <span className={bold ? "font-semibold text-white" : ""}>{value}</span>
  </div>
);

const Panier: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalItems, totalPrice, addItem, removeItem, decrementItem } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const computedTotalPrice: number = totalPrice;
  const totalArticles = totalItems;
  const shipping = 0; // digital
  const vatRate = 0.2;
  const vatAmount = computedTotalPrice * vatRate;
  const totalWithVat = computedTotalPrice + shipping;

  const hasItems = items.length > 0;

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!hasItems) {
      setStatus("error");
      setMessage("Ajoute au moins un beat pour continuer.");
      return;
    }
    setStatus("loading");
    setMessage(null);

    try {
      const data = await apiPost<{ url: string }>("/checkout/session", {
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/web/checkout/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/web/checkout/cancel`,
      });
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("URL manquante");
    } catch (e) {
      setStatus("error");
      setMessage("Impossible de lancer le paiement Stripe pour le moment.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070b] via-[#0c0c12] to-black text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-indigo-600/15 blur-[110px]" />
        <div className="absolute right-10 top-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative container mx-auto max-w-6xl px-4 xs:px-5 pt-20 pb-20">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Mon panier</h1>
          <p className="text-sm text-zinc-400">
            {totalArticles} article{totalArticles > 1 ? "s" : ""} · Sous-total {computedTotalPrice.toFixed(2)} EUR
          </p>
          {message && (
            <div
              className={`mx-auto mt-3 w-full max-w-xl rounded-xl border px-4 py-3 text-sm ${
                status === "success"
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                  : "border-amber-400/40 bg-amber-400/10 text-amber-100"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-3">
            {!hasItems && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-zinc-300">
                <PackageSearch className="h-8 w-8 text-zinc-400" />
                <div className="text-base font-semibold text-white">Votre panier est vide.</div>
                <p className="text-sm text-zinc-400">Ajoutez des beats depuis le catalogue ou la marketplace pour commencer.</p>
                <div className="flex gap-3">
                  <Link
                    href="/web/catalogue"
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                  >
                    Aller au catalogue
                  </Link>
                  <Link
                    href="/web/marketplace"
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                  >
                    Marketplace
                  </Link>
                </div>
              </div>
            )}

            {items.map((item) => {
              const priceVal = Number(item.price) || 0;
              const qtyVal = Number(item.quantity) || 0;
              const itemTotal = (priceVal * qtyVal).toFixed(2);

              return (
                <div
                  key={item.id}
                  className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm p-4 sm:p-5 shadow-[0_10px_60px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="truncate text-base font-semibold text-white">{item.name}</div>
                      <div className="text-xs text-zinc-400">Licence Basic · {priceVal.toFixed(2)} EUR</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                        <button onClick={() => decrementItem(item.id)} className="rounded-md p-1 hover:bg-white/10" aria-label="Diminuer">
                          <Minus size={14} />
                        </button>
                        <div className="min-w-6 text-center text-sm tabular-nums">{qtyVal}</div>
                        <button
                          onClick={() => addItem({ id: item.id, name: item.name, price: priceVal, beatId: item.beatId })}
                          className="rounded-md p-1 hover:bg-white/10"
                          aria-label="Augmenter"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="w-20 text-right text-sm font-semibold">{itemTotal} EUR</div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 rounded-md border border-white/10 p-2 text-zinc-200 hover:bg-white/10"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm shadow-[0_10px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CreditCard className="h-4 w-4 text-indigo-300" /> Récapitulatif
            </div>
            <SummaryRow label="Sous-total" value={`${computedTotalPrice.toFixed(2)} EUR`} />
            <SummaryRow label="TVA estimée (20%)" value={`${vatAmount.toFixed(2)} EUR`} />
            <SummaryRow label="Frais" value="0.00 EUR" />
            <div className="border-t border-white/10 pt-3">
              <SummaryRow label="Total" value={`${totalWithVat.toFixed(2)} EUR`} bold />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleCheckout}
                disabled={status === "loading" || !hasItems}
              >
                {status === "loading" ? "Traitement..." : "Valider et payer"}
              </button>
              <Link
                href="/web/catalogue"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Retour au catalogue
              </Link>
              <Link
                href="/web/marketplace"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explorer la marketplace
              </Link>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Téléchargements sécurisés et licences auto-générées après paiement.
            </div>
            {status === "success" && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
                <CheckCircle2 className="h-4 w-4" />
                Paiement démarré...
              </div>
            )}
            {status === "error" && message && <div className="text-xs text-rose-300">{message}</div>}
          </aside>
        </div>
      </div>
      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          router.push("/web/profil?mode=login");
        }}
        message="Cette action necessite d'etre connecte pour finaliser ton achat."
      />
    </div>
  );
};

export default Panier;
