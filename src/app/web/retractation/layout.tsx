import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Droit de rétractation",
  description: "Informations sur le droit de rétractation chez Beatmakerz.",
  alternates: { canonical: "/web/retractation" },
  openGraph: {
    title: "Droit de rétractation | Beatmakerz",
    url: "/web/retractation",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
