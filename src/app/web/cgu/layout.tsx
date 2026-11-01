import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGU",
  description: "Conditions générales d'utilisation de Beatmakerz.",
  alternates: { canonical: "/web/cgu" },
  openGraph: {
    title: "CGU | Beatmakerz",
    url: "/web/cgu",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
