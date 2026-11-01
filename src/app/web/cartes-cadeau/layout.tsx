import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartes cadeau",
  description: "Offre des prods à un artiste avec une carte cadeau Beatmakerz.",
  alternates: { canonical: "/web/cartes-cadeau" },
  openGraph: {
    title: "Cartes cadeau | Beatmakerz",
    url: "/web/cartes-cadeau",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
