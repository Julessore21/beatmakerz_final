import { LegalPage, type LegalSection } from "@/components/LegalPage";

export default function Page() {
  return <LegalPage title="Conditions générales de vente" updated="24 novembre 2026" current="/web/cgv" sections={sections} />;
}

const sections: LegalSection[] = [
  {
    title: "Préambule",
    content:
      "Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les transactions effectuées sur le site de vente d'instrumentales Beatmakerz. En passant commande sur notre site, vous acceptez sans réserve les présentes conditions.",
  },
  {
    title: "1. Identité de l'entreprise",
    content: [
      "Beatmakerz",
      "ASSOCIATION D ENTREPRENEURS",
      "Contact : beatmakerz.contact@gmail.com",
    ],
  },
  {
    title: "2. Produits et Services",
    content:
      "Nous proposons à la vente des instrumentales de musique en format numérique (fichier MP3, et fichier WAV lorsque l'instrumentale en dispose), ainsi que des productions sur mesure. Chaque instrumentale est décrite sur une page dédiée avec ses caractéristiques (titre, tempo, tonalité, formats disponibles, extrait).",
  },
  {
    title: "3. Prix",
    content: [
      "Les prix de nos instrumentales sont indiqués en euros (€) TTC. Nous nous réservons le droit de modifier les prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.",
      "Le prix de chaque instrumentale et de la prod sur mesure est affiché sur le site avant l'ajout au panier, puis rappelé avant le paiement.",
    ],
  },
  {
    title: "4. Commande",
    content:
      "Vous pouvez constituer votre panier sans compte. Un compte utilisateur est nécessaire pour payer : c'est dans ce compte que vos fichiers sont mis à disposition. Une fois votre panier validé, vous êtes redirigé vers la page de paiement sécurisée de Stripe. La prod sur mesure se commande depuis sa page, avec l'adresse e-mail à laquelle elle sera livrée.",
  },
  {
    title: "5. Paiement",
    content:
      "Le paiement s'effectue en ligne par carte bancaire. Nos transactions sont sécurisées par Stripe. Après validation de votre paiement, notre système vérifiera votre transaction.",
  },
  {
    title: "6. Livraison des Instrumentales",
    content:
      "Une fois le paiement validé, les fichiers compris dans la licence achetée (MP3, et WAV lorsque l'instrumentale en dispose) sont immédiatement téléchargeables depuis votre compte utilisateur. La prod sur mesure est livrée par e-mail.",
  },
  {
    title: "7. Droit de Rétractation",
    content:
      "Les conditions d'exercice et les exceptions au droit de rétractation sont détaillées sur notre page dédiée.",
    link: { href: "/web/retractation", label: "Voir la page Droit de rétractation" },
  },
  {
    title: "8. Garanties et Responsabilités",
    content:
      "Nous garantissons que les instrumentales sont libres de droits et peuvent être utilisées selon les termes de la licence achetée. Nous ne pouvons être tenus responsables des dommages indirects ou imprévisibles résultant de l'utilisation de notre site.",
  },
  {
    title: "9. Licence et Droits d'Utilisation",
    content: [
      "Licence non-exclusive : utilisation personnelle et commerciale autorisée. Revente interdite.",
      "Licence exclusive : droits exclusifs, l'instrumentale est retirée du site. Revente interdite.",
    ],
  },
  {
    title: "10. Résolution des Litiges",
    content:
      "En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. Les CGV sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents.",
  },
  {
    title: "11. Protection des Données",
    content:
      "Vos informations personnelles sont collectées et traitées conformément à notre politique de confidentialité. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
  },
  {
    title: "12. Contact",
    content:
      "Pour toute question ou demande, contactez-nous à : beatmakerz.contact@gmail.com",
  },
];
