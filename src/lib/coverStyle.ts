/**
 * SEULE règle du style d'une pochette : à quel style appartient une prod (d'après ses genres)
 * et les couleurs de chaque style. Les pochettes sont dessinées par le code à partir des vraies
 * données de la prod (titre, tempo, tonalité) : aucune image inventée.
 */
export type CoverStyleId = "trap" | "drill" | "cloud" | "lofi" | "boombap" | "afro" | "rage" | "emo" | "rnb" | "default";

export interface CoverStyle {
  id: CoverStyleId;
  /** Nom affiché sur la pochette. */
  label: string;
  /** Fond, texte, couleur forte (aussi pour l'aperçu des liens partagés). */
  bg: string;
  fg: string;
  accent: string;
}

export const COVER_STYLES: Record<CoverStyleId, CoverStyle> = {
  trap: { id: "trap", label: "Trap", bg: "#07060B", fg: "#FFFFFF", accent: "#7C5CFF" },
  drill: { id: "drill", label: "Drill", bg: "#070B14", fg: "#DCE6FF", accent: "#5B8CFF" },
  cloud: { id: "cloud", label: "Cloud", bg: "#B8B3F2", fg: "#1B1640", accent: "#FFFFFF" },
  lofi: { id: "lofi", label: "Lofi", bg: "#241810", fg: "#F4E3C8", accent: "#E8A25B" },
  boombap: { id: "boombap", label: "Boom bap", bg: "#ECE6D8", fg: "#111111", accent: "#D7322B" },
  afro: { id: "afro", label: "Afro", bg: "#170904", fg: "#FFE9D2", accent: "#F08A24" },
  rage: { id: "rage", label: "Rage", bg: "#090000", fg: "#FFFFFF", accent: "#FF1F3D" },
  emo: { id: "emo", label: "Emo", bg: "#0B0709", fg: "#FFE4F0", accent: "#FF5FA2" },
  rnb: { id: "rnb", label: "R&B", bg: "#16040F", fg: "#FFE3F0", accent: "#C2287A" },
  default: { id: "default", label: "Beatmakerz", bg: "#0E0B1A", fg: "#FFFFFF", accent: "#7C5CFF" },
};

/** Mots qui désignent chaque style, du plus précis au plus large (« emo trap » est emo, « trap » est trap). */
const RULES: [CoverStyleId, RegExp][] = [
  ["rage", /\brage\b/],
  ["emo", /\bemo\b/],
  ["drill", /\bdrill\b/],
  ["boombap", /\bboom ?bap\b|\bold ?school\b|\bdilla\b|\b90s\b/],
  ["lofi", /\blo-?fi\b|\bjazz\b/],
  ["cloud", /\bcloud\b|\bplugg\b|\bambient\b|\bhyperpop\b/],
  ["afro", /\bafro|\bdancehall\b|\bamapiano\b|\bjersey\b/],
  ["rnb", /\br ?(&|n|and) ?b\b|\bsoul\b/],
  ["trap", /\btrap\b|\bdark\b|\bmelo\b|\bchill\b|\bnew ?wave\b/],
];

export function coverStyleOf(genres: string[] | undefined | null): CoverStyle {
  const text = (genres ?? []).join(" ").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  // Le premier genre de la prod décide ; s'il ne dit rien, les suivants.
  for (const g of genres ?? []) {
    const one = g.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    for (const [id, re] of RULES) if (re.test(one)) return COVER_STYLES[id];
  }
  for (const [id, re] of RULES) if (re.test(text)) return COVER_STYLES[id];
  return COVER_STYLES.default;
}

/** Un nombre stable entre 0 et 1 tiré de l'identifiant : chaque prod a sa variante, toujours la même. */
export function seedOf(id: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}
