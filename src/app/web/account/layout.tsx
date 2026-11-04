import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Gère ton compte, tes achats et tes favoris.",
  alternates: { canonical: "/web/account" },
  openGraph: {
    title: "Mon compte | Beatmakerz",
    url: "/web/account",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
