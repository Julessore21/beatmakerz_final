import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Beatmakerz.",
  alternates: { canonical: "/web/mentions" },
  openGraph: {
    title: "Mentions légales | Beatmakerz",
    url: "/web/mentions",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
