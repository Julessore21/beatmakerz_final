import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendre ses prods (Espace Vendeur)",
  description:
    "Rejoins Beatmakerz et vends tes instrumentales en quelques minutes. Tableau de bord vendeur, mises en ligne simples, paiements sécurisés et exposition aux artistes.",
  alternates: { canonical: "/web/vendeur" },
  openGraph: {
    title: "Espace Vendeur | Beatmakerz",
    description:
      "Deviens vendeur sur Beatmakerz: uploads rapides, suivi des ventes, visibilité auprès d'artistes actifs.",
    url: "/web/vendeur",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

