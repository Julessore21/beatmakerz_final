import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace beatmakers",
  description: "Découvre des beatmakers, écoute leurs prods et contacte-les.",
  alternates: { canonical: "/web/marketplace" },
  openGraph: {
    title: "Marketplace beatmakers | Beatmakerz",
    url: "/web/marketplace",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

