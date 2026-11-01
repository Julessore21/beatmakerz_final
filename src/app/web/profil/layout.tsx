/**
 * Layout pour la page profil
 * Force le rendu dynamique pour éviter l'erreur useSearchParams
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil",
  alternates: { canonical: "/web/profil" },
};

export const dynamic = 'force-dynamic';

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
