import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGV",
  description: "Conditions générales de vente de Beatmakerz.",
  alternates: { canonical: "/web/cgv" },
  openGraph: {
    title: "CGV | Beatmakerz",
    url: "/web/cgv",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
