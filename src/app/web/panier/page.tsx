"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Trash2, ShieldCheck, CreditCard, PackageSearch, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import AuthRequiredModal from "@/components/AuthRequiredModal";
import RetractationConsent from "@/components/RetractationConsent";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell, PageHeader } from "@/components/ui/page";

const VAT_RATE = 0.2;
const fmt = (value: number) => `${value.toFixed(2)} €`;

const SummaryRow = ({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-zinc-400">{label}</span>
    <span className={bold ? "text-base font-semibold text-white" : "text-zinc-200"}>{value}</span>
  </div>
);

export default function PanierPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, removeItem, checkout } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [consent, setConsent] = useState(false);

  const hasItems = items.length > 0;
  // Les prix affichés sont TTC : on extrait la part de TVA.
  const vatAmount = totalPrice - totalPrice / (1 + VAT_RATE);

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setError(null);
    setLoading(true);
    const failure = await checkout();
    if (failure) {
      setError(failure);
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="Mon panier"
        subtitle={`${items.length} beat${items.length > 1 ? "s" : ""} · ${fmt(totalPrice)}`}
      />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-3">
          {!hasItems && (
            <Card className="flex flex-col items-center gap-3 py-10 text-center">
              <PackageSearch className="h-8 w-8 text-zinc-400" />
              <p className="text-base font-semibold">Ton panier est vide.</p>
              <p className="text-sm text-zinc-400">Ajoute des beats depuis le catalogue pour commencer.</p>
              <ButtonLink href="/web/catalogue" className="mt-2">
                Aller au catalogue
              </ButtonLink>
            </Card>
          )}

          {items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{item.name}</p>
                <p className="text-xs text-zinc-400">Licence Basic</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tabular-nums">{fmt(Number(item.price) || 0)}</span>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label={`Retirer ${item.name}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-fit space-y-4 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CreditCard className="h-4 w-4 text-brand-lavender" /> Récapitulatif
          </div>
          <SummaryRow label="Sous-total HT" value={fmt(totalPrice - vatAmount)} />
          <SummaryRow label="TVA (20 %)" value={fmt(vatAmount)} />
          <div className="border-t border-white/10 pt-3">
            <SummaryRow label="Total TTC" value={fmt(totalPrice)} bold />
          </div>

          <RetractationConsent checked={consent} onChange={setConsent} />

          <div className="flex flex-col gap-2 pt-2">
            <Button fullWidth size="lg" onClick={handleCheckout} disabled={loading || !hasItems || !consent}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              {loading ? "Redirection vers Stripe…" : "Payer avec Stripe"}
            </Button>
            <ButtonLink href="/web/catalogue" variant="outline" fullWidth>
              Continuer mes achats
            </ButtonLink>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <p className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
            Paiement sécurisé par Stripe. Tes fichiers sont disponibles dans ton compte dès la validation.
          </p>
          <p className="text-center text-xs text-zinc-400">
            100&nbsp;% royalty free ·{" "}
            <Link href="/web/cgv" className="underline hover:text-white">
              CGV
            </Link>
          </p>
        </Card>
      </div>

      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          router.push("/web/profil?mode=login&next=/web/panier");
        }}
        message="Connecte-toi pour finaliser ton achat."
      />
    </PageShell>
  );
}
