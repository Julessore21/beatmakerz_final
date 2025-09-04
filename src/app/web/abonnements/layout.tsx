import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abonnements",
  description: "Accès mensuel à nos prods, économise avec les formules INFINI.",
  alternates: { canonical: "/web/abonnements" },
  openGraph: {
    title: "Abonnements | Beatmakerz",
    url: "/web/abonnements",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

