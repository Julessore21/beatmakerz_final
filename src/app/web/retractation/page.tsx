"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DroitDeRetractation() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
          >
            <h1 className="text-4xl font-bold tracking-tight">Droit de rétractation</h1>
            <p className="mt-1 text-sm text-zinc-400">Informations sur vos droits pour les contenus digitaux (beats, licences, abonnements)</p>
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
  );
}

const sections: { title: string; content: string | string[] }[] = [
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
    title: "3. Abonnements",
    content: [
      "Pour les formules Infini, Infini+ ou Infini X, l'accès est ouvert immédiatement après paiement.",
      "Vous pouvez résilier à tout moment pour le terme à échéance, mais la rétractation n'est plus possible dès lors que les avantages (téléchargements/licences) ont été activés.",
    ],
  },
  {
    title: "4. Comment faire une demande",
    content: [
      "Si aucun téléchargement ou accès n'a eu lieu et que vous êtes dans les 14 jours, contactez-nous à support@beatmakerz.fr avec : nom, e-mail, référence commande, date d'achat.",
      "Nous analyserons votre demande sous 14 jours ouvrés et procéderons à un remboursement si les conditions légales sont remplies.",
    ],
  },
  {
    title: "5. Effets de la rétractation",
    content:
      "En cas d'acceptation, nous rembourserons le paiement reçu (hors frais éventuels liés aux options supplémentaires) via le moyen de paiement initial dans un délai maximum de 14 jours.",
  },
  {
    title: "6. Exceptions",
    content: [
      "Contenus numériques fournis avant la fin du délai de rétractation avec votre accord expresse et votre renoncement (beats, licences).",
      "Prestations personnalisées ou prod sur mesure déjà lancées.",
      "Services pleinement exécutés avant votre demande.",
    ],
  },
  {
    title: "7. Contact",
    content: [
      "E-mail : support@beatmakerz.fr",
      "Formulaire : /web/contact",
      "Adresse : Beatmakerz, 10 rue des Prods, 75000 Paris",
    ],
  },
];
