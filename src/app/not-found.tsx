import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-[14px] text-fg-faint">404</p>
      <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.02em] sm:text-[40px]">Cette page n’existe pas.</h1>
      <p className="mt-3 text-fg-muted">Le lien est peut-être ancien. Les prods, elles, sont toujours là.</p>
      <ButtonLink href="/web/catalogue" size="lg" className="mt-8">
        Voir le catalogue
      </ButtonLink>
    </div>
  );
}
