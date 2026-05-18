/**
 * Mapping genre → image de couverture automatique
 * Les fichiers sont dans /public/img/ (ex: /img/drill.png)
 * Ajoute les fichiers correspondants dans public/img/ pour activer chaque genre.
 */
const GENRE_COVER_MAP: Record<string, string> = {
  // --- Hip-Hop / Rap ---
  "trap":         "/img/trap.png",
  "trap soul":    "/img/trap.png",
  "drill":        "/img/drill.png",
  "hip-hop":      "/img/hip-hop.png",
  "hip hop":      "/img/hip-hop.png",
  "boom bap":     "/img/boom-bap.png",
  "east coast":   "/img/hip-hop.png",
  "west coast":   "/img/hip-hop.png",
  "cloud rap":    "/img/cloud-rap.png",
  "plugg":        "/img/plugg.png",
  "phonk":        "/img/phonk.png",
  "detroit":      "/img/phonk.png",

  // --- R&B / Soul ---
  "r&b":          "/img/rnb.png",
  "rnb":          "/img/rnb.png",
  "soul":         "/img/soul.png",

  // --- Afro / Caraïbes ---
  "afrobeat":     "/img/afrobeat.png",
  "afro":         "/img/afrobeat.png",
  "afro trap":    "/img/afrobeat.png",
  "afrotrap":     "/img/afrobeat.png",
  "dancehall":    "/img/dancehall.png",
  "reggaeton":    "/img/reggaeton.png",
  "amapiano":     "/img/amapiano.png",

  // --- Electronic / Autres ---
  "pop":          "/img/pop.png",
  "pop urbain":   "/img/pop.png",
  "lo-fi":        "/img/lofi.png",
  "lofi":         "/img/lofi.png",
  "lo fi":        "/img/lofi.png",
  "jazz":         "/img/jazz.png",
  "new jazz":     "/img/jazz.png",
  "electro":      "/img/electro.png",
  "jersey":       "/img/jersey.png",
  "jersey club":  "/img/jersey.png",
  "new wave":     "/img/newwave.png",
  "melancolique": "/img/melancolique.png",
  "melancholic":  "/img/melancolique.png",
};

/**
 * Retourne le chemin de l'image de couverture pour un genre donné.
 * Retourne null si aucun mapping n'existe pour ce genre.
 */
export function getGenreCover(genre: string): string | null {
  const key = genre.toLowerCase().trim();
  return GENRE_COVER_MAP[key] ?? null;
}

/**
 * Retourne la meilleure cover disponible pour un beat :
 * 1. coverUrl (image uploadée sur FileUp) si disponible
 * 2. Image de genre automatique selon le premier genre matchant
 * 3. null si aucune image disponible
 */
export function getBeatCover(
  coverUrl: string | null | undefined,
  genres: string[]
): string | null {
  if (coverUrl) return coverUrl;
  for (const g of genres) {
    const img = getGenreCover(g);
    if (img) return img;
  }
  return null;
}
