import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question ? Écris-nous, on te répond rapidement.",
  alternates: { canonical: "/web/contact" },
  openGraph: {
    title: "Contact | Beatmakerz",
    url: "/web/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

