import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panier",
  description: "Récapitulatif de tes articles et paiement sécurisé.",
  alternates: { canonical: "/web/panier" },
  openGraph: {
    title: "Panier | Beatmakerz",
    url: "/web/panier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

