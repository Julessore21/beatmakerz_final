import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Toutes les prods Beatmakerz : trap, drill, cloud, lofi. Écoute les extraits, filtre par genre et tempo, achète la licence en un clic.",
  alternates: { canonical: "/web/catalogue" },
  openGraph: { title: "Catalogue · Beatmakerz", url: "/web/catalogue" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
