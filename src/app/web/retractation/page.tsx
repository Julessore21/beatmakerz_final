import { LegalPage, type LegalSection } from "@/components/LegalPage";

export default function Page() {
  return <LegalPage title="Droit de rétractation" current="/web/retractation" sections={sections} />;
}

const sections: LegalSection[] = [
  {
    title: "1. Cadre légal",
    content:
      "Conformément aux articles L221-18 et suivants du Code de la consommation, vous disposez en principe de 14 jours pour exercer votre droit de rétractation à compter de la conclusion du contrat.",
  },
  {
    title: "2. Spécificités des contenus numériques",
    content: [
      "Les beats, licences et packs disponibles sur Beatmakerz sont des contenus numériques fournis immédiatement après l'achat.",
      "En validant votre paiement, vous acceptez expressément que l'exécution commence avant la fin du délai de rétractation et reconnaissez perdre ce droit une fois le téléchargement ou l'accès démarré (article L221-28 13°).",
    ],
  },
  {
    title: "3. Comment faire une demande",
    content: [
      "Si aucun téléchargement ou accès n'a eu lieu et que vous êtes dans les 14 jours, contactez-nous à beatmakerz.contact@gmail.com avec : nom, e-mail, référence commande, date d'achat.",
      "Nous analyserons votre demande sous 14 jours ouvrés et procéderons à un remboursement si les conditions légales sont remplies.",
    ],
  },
  {
    title: "4. Effets de la rétractation",
    content:
      "En cas d'acceptation, nous rembourserons le paiement reçu (hors frais éventuels liés aux options supplémentaires) via le moyen de paiement initial dans un délai maximum de 14 jours.",
  },
  {
    title: "5. Exceptions",
    content: [
      "Contenus numériques fournis avant la fin du délai de rétractation avec votre accord expresse et votre renoncement (beats, licences).",
      "Prestations personnalisées ou prod sur mesure déjà lancées.",
      "Services pleinement exécutés avant votre demande.",
    ],
  },
  {
    title: "6. Contact",
    content: [
      "E-mail : beatmakerz.contact@gmail.com",
      "Formulaire de contact : rubrique Contact du site",
    ],
  },
];
