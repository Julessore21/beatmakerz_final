import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Les réponses à tes questions sur les beats, les licences et les paiements.",
  alternates: { canonical: "/web/faq" },
  openGraph: {
    title: "FAQ | Beatmakerz",
    url: "/web/faq",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
