/**
 * Layout pour la page profil
 * Force le rendu dynamique pour éviter l'erreur useSearchParams
 */

export const dynamic = 'force-dynamic';

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
