import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement annulé",
  description: "Ton paiement n'a pas abouti. Reprends ta commande quand tu veux.",
  alternates: { canonical: "/web/checkout/cancel" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
