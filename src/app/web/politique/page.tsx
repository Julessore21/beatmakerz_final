import { LegalPage, type LegalSection } from "@/components/LegalPage";

export default function Page() {
  return <LegalPage title="Politique de confidentialité" updated="24 novembre 2026" current="/web/politique" sections={sections} />;
}

const sections: LegalSection[] = [
  {
    title: "Introduction",
    content:
      "Beatmakerz prend la protection de vos données personnelles au sérieux. Cette politique explique quelles informations nous collectons, pourquoi, avec qui elles sont partagées et quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.",
  },
  {
    title: "1. Données collectées",
    content: [
      "Compte : adresse e-mail, nom d’artiste et mot de passe (conservé uniquement sous forme chiffrée).",
      "Achats : prods achetées, licence, montant, date. Le paiement est traité par Stripe : nous ne voyons ni ne conservons jamais vos données bancaires.",
      "Prod sur mesure : le brief que vous remplissez (genre, tempo, ambiance, références) et l’adresse e-mail de livraison.",
      "Données techniques : adresse IP et informations du navigateur, enregistrées par nos hébergeurs pour la sécurité et le bon fonctionnement du site.",
    ],
  },
  {
    title: "2. Utilisation",
    content: ["Créer et gérer votre compte", "Traiter vos achats et mettre vos fichiers à disposition", "Réaliser et livrer les prods sur mesure", "Répondre à vos messages", "Respecter nos obligations légales (comptabilité, fiscalité)"],
  },
  {
    title: "3. Partage",
    content: [
      "Stripe (paiement), Cloudflare (site et stockage des fichiers), Google Cloud (serveur applicatif) et MongoDB Atlas (base de données) : uniquement pour faire fonctionner le service.",
      "Autorités, si la loi l’exige.",
      "Vos données ne sont jamais vendues ni utilisées pour de la publicité.",
    ],
  },
  {
    title: "4. Sécurité",
    content: "Connexions chiffrées (HTTPS), mots de passe chiffrés, fichiers achetés servis par des liens personnels et temporaires, accès à l’administration restreint.",
  },
  {
    title: "5. Durée de conservation",
    content: "Les données du compte sont conservées tant que le compte existe. Les données d’achat sont conservées pendant la durée imposée par les obligations comptables (10 ans). Vous pouvez demander la suppression de votre compte à tout moment.",
  },
  {
    title: "6. Vos droits",
    content: [
      "Accès, rectification et suppression de vos données",
      "Opposition et limitation du traitement",
      "Portabilité",
      "Réclamation auprès de la CNIL (cnil.fr)",
      "Pour exercer ces droits : beatmakerz.contact@gmail.com",
    ],
  },
  {
    title: "7. Cookies et stockage local",
    content: [
      "Un seul cookie, technique et indispensable : il garde votre connexion active.",
      "Votre panier (avant connexion) et le volume du lecteur sont gardés dans votre navigateur, jamais envoyés ailleurs.",
      "Aucun cookie publicitaire ni de mesure d’audience.",
    ],
  },
  {
    title: "8. Contact",
    content: ["E-mail : beatmakerz.contact@gmail.com", "Coordonnées de l’éditeur : voir les mentions légales"],
  },
];
