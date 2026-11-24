"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ButtonLink } from "@/components/ui/Button";

export default function SuccessPage() {
  const { refresh } = useCart();
  // L'API vide le panier à la confirmation du paiement : on le relit.
  useEffect(() => {
    const t = setTimeout(() => void refresh(), 1500);
    return () => clearTimeout(t);
  }, [refresh]);
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center text-center">
      <CheckCircle2 className="h-12 w-12 text-accent" />
      <h1 className="mt-6 text-[32px] font-semibold tracking-[-0.02em] sm:text-[40px]">Merci, c’est payé.</h1>
      <p className="mt-3 max-w-md text-fg-muted">Tes prods sont dans ton compte, prêtes à télécharger. Si elles n’apparaissent pas tout de suite, recharge la page dans quelques secondes.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/web/account" size="lg">
          Télécharger mes prods
        </ButtonLink>
        <ButtonLink href="/web/catalogue" size="lg" variant="secondary">
          Continuer mes achats
        </ButtonLink>
      </div>
    </div>
  );
}
