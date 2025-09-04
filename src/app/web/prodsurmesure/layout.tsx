import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prod sur mesure",
  description: "Commande ta prod personnalisée auprès de notre collectif.",
  alternates: { canonical: "/web/prodsurmesure" },
  openGraph: {
    title: "Prod sur mesure | Beatmakerz",
    url: "/web/prodsurmesure",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

