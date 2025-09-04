import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion / Inscription",
  description: "Connecte-toi ou crée un compte Beatmakerz en quelques secondes.",
  alternates: { canonical: "/web/profil" },
  openGraph: {
    title: "Profil | Beatmakerz",
    url: "/web/profil",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

