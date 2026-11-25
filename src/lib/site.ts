/** Ce que le site dit de Beatmakerz : une seule source pour l'en-tête, le pied de page et les pages. */
export const SITE = {
  name: "Beatmakerz",
  email: "beatmakerz.contact@gmail.com",
  socials: {
    tiktok: "https://www.tiktok.com/@beatmakerz.pro",
    instagram: "https://www.instagram.com/beatmakerz_pro/",
    youtube: "https://www.youtube.com/@BEATMAKERZ-PRO",
  },
  tiktokFollowers: "40 000",
} as const;

export const NAV = [
  { href: "/web/catalogue", label: "Catalogue" },
  { href: "/web/prodsurmesure", label: "Sur mesure" },
  { href: "/#licence", label: "Licence" },
  { href: "/web/faq", label: "FAQ" },
] as const;

export const LEGAL = [
  { href: "/web/cgv", label: "Conditions de vente" },
  { href: "/web/cgu", label: "Conditions d’utilisation" },
  { href: "/web/mentions", label: "Mentions légales" },
  { href: "/web/politique", label: "Confidentialité" },
  { href: "/web/retractation", label: "Rétractation" },
] as const;
