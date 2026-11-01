import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarification",
  description: "Les tarifs et licences des prods Beatmakerz.",
  alternates: { canonical: "/web/tarification" },
  openGraph: {
    title: "Tarification | Beatmakerz",
    url: "/web/tarification",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
