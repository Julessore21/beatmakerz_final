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
          <h1 className="text-4xl font-bold tracking-tight">Droit de r&eacute;tractation</h1>
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
    title: "1. Cadre l&eacute;gal",
    content:
      "Conform&eacute;ment aux articles L221-18 et suivants du Code de la consommation, vous disposez en principe de 14 jours pour exercer votre droit de r&eacute;tractation &agrave; compter de la conclusion du contrat.",
  },
  {
    title: "2. Sp&eacute;cificit&eacute;s des contenus num&eacute;riques",
    content: [
      "Les beats, licences et packs disponibles sur Beatmakerz sont des contenus num&eacute;riques fournis imm&eacute;diatement apr&egrave;s l'achat.",
      "En validant votre paiement, vous acceptez express&eacute;ment que l'ex&eacute;cution commence avant la fin du d&eacute;lai de r&eacute;tractation et reconnaissez perdre ce droit une fois le t&eacute;l&eacute;chargement ou l'acc&egrave;s d&eacute;marr&eacute; (article L221-28 13&deg;).",
    ],
  },
  {
    title: "3. Abonnements",
    content: [
      "Pour les formules Infini, Infini+ ou Infini X, l'acc&egrave;s est ouvert imm&eacute;diatement apr&egrave;s paiement.",
      "Vous pouvez r&eacute;silier &agrave; tout moment pour le terme &agrave; &eacute;ch&eacute;ance, mais la r&eacute;tractation n'est plus possible d&egrave;s lors que les avantages (t&eacute;l&eacute;chargements/licences) ont &eacute;t&eacute; activ&eacute;s.",
    ],
  },
  {
    title: "4. Comment faire une demande",
    content: [
      "Si aucun t&eacute;l&eacute;chargement ou acc&egrave;s n'a eu lieu et que vous &ecirc;tes dans les 14 jours, contactez-nous &agrave; support@beatmakerz.fr avec : nom, e-mail, r&eacute;f&eacute;rence commande, date d'achat.",
      "Nous analyserons votre demande sous 14 jours ouvr&eacute;s et proc&eacute;derons &agrave; un remboursement si les conditions l&eacute;gales sont remplies.",
    ],
  },
  {
    title: "5. Effets de la r&eacute;tractation",
    content:
      "En cas d'acceptation, nous rembourserons le paiement re&ccedil;u (hors frais &eacute;ventuels li&eacute;s aux options suppl&eacute;mentaires) via le moyen de paiement initial dans un d&eacute;lai maximum de 14 jours.",
  },
  {
    title: "6. Exceptions",
    content: [
      "Contenus num&eacute;riques fournis avant la fin du d&eacute;lai de r&eacute;tractation avec votre accord expresse et votre renoncement (beats, licences).",
      "Prestations personnalis&eacute;es ou prod sur mesure d&eacute;j&agrave; lanc&eacute;es.",
      "Services pleinement ex&eacute;cut&eacute;s avant votre demande.",
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
