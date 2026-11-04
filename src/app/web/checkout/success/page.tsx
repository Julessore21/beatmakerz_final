"use client";

import React, { useEffect } from "react";
import { CheckCircle, Download } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page";

export default function CheckoutSuccessPage() {
  const { refresh } = useCart();

  // Le webhook Stripe vide le panier côté API : on resynchronise l'affichage
  // (deux fois, au cas où le webhook arrive juste après la redirection).
  useEffect(() => {
    void refresh();
    const timer = setTimeout(() => void refresh(), 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageShell size="md" className="flex min-h-[80vh] items-center">
      <Card className="w-full p-8 sm:p-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-300">Paiement validé</p>
            <h1 className="text-2xl font-semibold">Merci pour ton achat !</h1>
          </div>
        </div>

        <p className="mt-6 text-sm text-zinc-300">
          Tes beats sont disponibles au téléchargement dans ton compte. Stripe t’envoie aussi le reçu par e-mail.
          Si un achat n’apparaît pas tout de suite, actualise la page dans quelques secondes.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/web/account#achats" size="lg">
            <Download className="h-4 w-4" /> Télécharger mes beats
          </ButtonLink>
          <ButtonLink href="/web/catalogue" variant="outline" size="lg">
            Continuer mes achats
          </ButtonLink>
        </div>
      </Card>
    </PageShell>
  );
}
