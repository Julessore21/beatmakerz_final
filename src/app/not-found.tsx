import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 text-white">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-lavender">Erreur 404</p>
        <h1 className="mt-2 text-4xl font-bold">Cette page n’existe pas</h1>
        <p className="mt-3 text-sm text-zinc-400">Le lien est peut-être cassé, ou la page a été déplacée.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/web/catalogue">Voir le catalogue</ButtonLink>
          <ButtonLink href="/" variant="outline">
            Accueil
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
