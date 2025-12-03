"use client";

import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function MentionsLegales() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <h1 className="text-4xl font-bold tracking-tight">Mentions légales</h1>
          <p className="mt-1 text-sm text-zinc-400">Informations légales et obligations réglementaires</p>
        </motion.div>

        <div className="mt-8 space-y-6">
          {sections.map(({ title, content }, index) => (
            <section key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <h2 className="text-lg font-semibold">{title}</h2>
              {typeof content === "string" ? (
                <p className="mt-2 text-sm text-zinc-300">{content}</p>
              ) : (
                <ul className="mt-2 list-disc list-inside text-sm text-zinc-300 space-y-1">
                  {content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

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
