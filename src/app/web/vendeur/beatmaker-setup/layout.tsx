import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurer son profil beatmaker",
  description:
    "Configure ton profil vendeur Beatmakerz: avatar, description, réseaux et préférences de vente.",
  alternates: { canonical: "/web/vendeur/beatmaker-setup" },
  openGraph: {
    title: "Setup Beatmaker | Beatmakerz",
    url: "/web/vendeur/beatmaker-setup",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

