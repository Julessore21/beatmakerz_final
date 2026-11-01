import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment Beatmakerz protège et utilise tes données.",
  alternates: { canonical: "/web/politique" },
  openGraph: {
    title: "Politique de confidentialité | Beatmakerz",
    url: "/web/politique",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
