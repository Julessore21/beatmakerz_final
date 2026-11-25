import { LegalPage, type LegalSection } from "@/components/LegalPage";

export default function Page() {
  return <LegalPage title="Mentions légales" updated="24 novembre 2026" current="/web/mentions" sections={sections} />;
}

const sections: LegalSection[] = [
  {
    title: "Éditeur du site",
    content: [
      "BEATMAKERZ",
      "ASSOCIATION D'ENTREPRENEURS",
      "Contact : beatmakerz.contact@gmail.com",
    ],
  },
  {
    title: "Hébergement du site",
    content: [
      "Site : Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis — cloudflare.com",
      "Serveur applicatif : Google Cloud (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande) — cloud.google.com",
      "Base de données : MongoDB Atlas (MongoDB, Inc.) — mongodb.com",
    ],
  },
  {
    title: "Hébergement des instrumentales",
    content: "Cloudflare R2 (Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis) — cloudflare.com",
  },
  {
    title: "Contact",
    content: [
      "Pour toute question ou réclamation concernant le site, vous pouvez nous contacter :",
      "Email : beatmakerz.contact@gmail.com",
    ],
  },
  {
    title: "Propriété Intellectuelle",
    content:
      "Tous les contenus présents sur ce site (graphismes, images, textes, vidéos, animations, sons, logos, gifs, icônes, etc.) ainsi que leur mise en forme sont la propriété exclusive de Beatmakerz, à l'exception des marques, logos ou contenus appartenant à des sociétés partenaires ou auteurs. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, est strictement interdite sans l'accord écrit de Beatmakerz. Toute représentation ou reproduction, par quelque procédé que ce soit, constitue une contrefaçon (articles L.335-2 et suivants du Code de la propriété intellectuelle) et peut engager la responsabilité civile et pénale du contrefacteur.",
  },
  {
    title: "Protection des Données Personnelles",
    content:
      "Beatmakerz s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site Beatmakerz, soient conformes au RGPD et à la loi Informatique et Libertés. Pour plus d'informations, consultez notre Politique de Confidentialité.",
  },
  {
    title: "Cookies",
    content:
      "Le site n'utilise qu'un cookie technique, indispensable pour rester connecté. Aucun cookie publicitaire ni de mesure d'audience. Détails dans la politique de confidentialité.",
  },
  {
    title: "Limitation de responsabilité",
    content:
      "Beatmakerz ne saurait être tenu pour responsable des erreurs présentes sur le site, des problèmes techniques, des interprétations des informations publiées et des conséquences de leur utilisation. L'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.",
  },
  {
    title: "Liens Hypertextes",
    content:
      "Le site Beatmakerz peut proposer des liens vers d'autres sites ou ressources disponibles sur Internet. Beatmakerz n'exerce aucun contrôle sur ces sites externes et ne saurait être tenu responsable de leur disponibilité ou de leur contenu.",
  },
  {
    title: "Droit Applicable",
    content:
      "Les présentes mentions légales sont régies par le droit français. En cas de litige et après échec d'une solution amiable, les tribunaux français seront seuls compétents.",
  },
];
