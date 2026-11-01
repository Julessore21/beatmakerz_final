import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement validé",
  description: "Merci pour ton achat. Retrouve tes téléchargements et licences dans ton compte.",
  alternates: { canonical: "/web/checkout/success" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
