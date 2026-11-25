import { ButtonLink } from "@/components/ui/Button";

export default function CancelPage() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-[32px] font-semibold tracking-[-0.02em] sm:text-[40px]">Paiement annulé</h1>
      <p className="mt-3 max-w-md text-fg-muted">Rien n’a été débité. Ton panier t’attend, tu peux reprendre quand tu veux.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/web/panier" size="lg">
          Revenir au panier
        </ButtonLink>
        <ButtonLink href="/web/catalogue" size="lg" variant="secondary">
          Voir le catalogue
        </ButtonLink>
      </div>
    </div>
  );
}
