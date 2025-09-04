import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue de beats",
  description: "Découvre notre catalogue de prods: trap, drill, R&B, lofi et plus.",
  alternates: { canonical: "/web/catalogue" },
  openGraph: {
    title: "Catalogue de beats | Beatmakerz",
    url: "/web/catalogue",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

