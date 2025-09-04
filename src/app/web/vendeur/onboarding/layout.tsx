import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding vendeur",
  description:
    "Étapes d'onboarding pour publier tes premières prods: informations, upload, pré-écoutes et publication.",
  alternates: { canonical: "/web/vendeur/onboarding" },
  openGraph: {
    title: "Onboarding Vendeur | Beatmakerz",
    url: "/web/vendeur/onboarding",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

