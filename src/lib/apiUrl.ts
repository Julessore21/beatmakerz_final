/**
 * Adresse de l'API Beatmakerz, seule source pour tout le site.
 * NEXT_PUBLIC_API_URL est figée au moment de la construction : sur Cloudflare,
 * elle se règle dans les variables de construction (Build variables).
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
