import { XCircle, ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page";

export default function CheckoutCancelPage() {
  return (
    <PageShell size="md" className="flex min-h-[80vh] items-center">
      <Card className="w-full p-8 sm:p-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-300">Paiement annulé</p>
            <h1 className="text-2xl font-semibold">Aucun montant n’a été débité</h1>
          </div>
        </div>

        <p className="mt-6 text-sm text-zinc-300">
          Ton panier est conservé. Tu peux relancer le paiement quand tu veux, ou nous écrire si quelque chose
          s’est mal passé.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/web/panier" size="lg">
            <ArrowLeft className="h-4 w-4" /> Retour au panier
          </ButtonLink>
          <ButtonLink href="/web/contact" variant="outline" size="lg">
            Contacter le support
          </ButtonLink>
        </div>
      </Card>
    </PageShell>
  );
}
