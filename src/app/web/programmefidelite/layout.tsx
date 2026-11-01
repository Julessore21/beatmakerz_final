import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programme fidélité",
  description: "Découvre le programme fidélité Beatmakerz.",
  alternates: { canonical: "/web/programmefidelite" },
  openGraph: {
    title: "Programme fidélité | Beatmakerz",
    url: "/web/programmefidelite",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
