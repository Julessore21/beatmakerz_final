import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre histoire",
  description: "Découvre le collectif Beatmakerz et ce qui nous anime.",
  alternates: { canonical: "/web/notrehistoire" },
  openGraph: {
    title: "Notre histoire | Beatmakerz",
    url: "/web/notrehistoire",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
