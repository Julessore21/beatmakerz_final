"use client";

import React from "react";

const MentionsLegales: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mt-16 mb-12">
          MENTIONS LÉGALES
        </h1>

        {sections.map(({ title, content }, index) => (
          <section className="mb-8" key={index}>
            <h2 className="text-2xl font-bold mb-4 underline decoration-[#401a87] decoration-1">
              {title}
            </h2>

            {typeof content === "string" ? (
              <p className="text-gray-300 ml-4">{content}</p>
            ) : (
              <ul className="list-disc list-inside ml-8 text-gray-300 space-y-1">
                {content.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default MentionsLegales;

const sections: { title: string; content: string | string[] }[] = [
  {
    title: "Éditeur du site",
    content: [
      "BEATMAKERZ",
      "ASSOCIATION D'ENTREPRENEURS",
      "Siège social : [Adresse du siège social]",
      "Numéro d'immatriculation : [Numéro d'inscription au registre du commerce et des sociétés]",
      "Numéro de TVA intracommunautaire : [Numéro de TVA, si applicable]",
      "Directeur de la publication : [Nom du responsable de la publication]",
    ],
  },
  {
    title: "Hébergement du site",
    content: [
      "WIX",
      "Adresse de l'hébergeur : [Adresse de l'hébergeur]",
      "Numéro de téléphone de l'hébergeur : [Numéro de téléphone de l'hébergeur]",
    ],
  },
  {
    title: "Hébergement des instrumentales",
    content: "file-up.fr",
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
      "Tous les contenus présents sur ce site (graphismes, images, textes, vidéos, animations, sons, logos, gifs, icônes, etc.) ainsi que leur mise en forme sont la propriété exclusive de [BEATMAKERZ], à l'exception des marques, logos ou contenus appartenant à des sociétés partenaires ou auteurs. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, est strictement interdite sans l'accord écrit de [Nom de l'entreprise]. Toute représentation ou reproduction, par quelque procédé que ce soit, constitue une contrefaçon (articles L.335-2 et suivants du Code de la propriété intellectuelle) et peut engager la responsabilité civile et pénale du contrefacteur.",
  },
  {
    title: "Protection des Données Personnelles",
    content:
      "[Nom de l'entreprise] s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site [Nom du Site], soient conformes au RGPD et à la loi Informatique et Libertés. Pour plus d'informations, consultez notre Politique de Confidentialité.",
  },
  {
    title: "Cookies",
    content:
      "Le site [Nom du Site] utilise des cookies pour améliorer l'expérience utilisateur, analyser le trafic et personnaliser le contenu. En poursuivant votre navigation, vous acceptez l'utilisation de ces cookies. Vous pouvez modifier vos préférences via votre navigateur.",
  },
  {
    title: "Limitation de responsabilité",
    content:
      "[Nom de l'entreprise] ne saurait être tenu pour responsable des erreurs présentes sur le site, des problèmes techniques, des interprétations des informations publiées et des conséquences de leur utilisation. L'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.",
  },
  {
    title: "Liens Hypertextes",
    content:
      "Le site [Nom du Site] peut proposer des liens vers d'autres sites ou ressources disponibles sur Internet. [Nom de l'entreprise] n'exerce aucun contrôle sur ces sites externes et ne saurait être tenu responsable de leur disponibilité ou de leur contenu.",
  },
  {
    title: "Droit Applicable",
    content:
      "Les présentes mentions légales sont régies par le droit français. En cas de litige et après échec d'une solution amiable, les tribunaux français seront seuls compétents.",
  },
];
