import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement",
  description: "Finalise ta commande de beats en toute sécurité avec Stripe.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
