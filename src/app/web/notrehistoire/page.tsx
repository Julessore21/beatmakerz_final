// TODO: texte placeholder — à relire et remplacer par le vrai contenu éditorial avant mise en prod
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function NotreHistoire() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-3">
            Le collectif
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Notre histoire</h1>
          <p className="mt-2 text-sm text-zinc-400">
            De la passion à la plateforme — l&apos;aventure Beatmakerz.
          </p>
        </motion.div>

        <div className="mt-8 space-y-6">
          {sections.map(({ title, content }, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * (index + 1) }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{content}</p>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}

const sections: { title: string; content: string }[] = [
  {
    title: "Les origines",
    content:
      "Beatmakerz est né d'une conviction simple : les producteurs indépendants méritent un espace dédié où exposer leur travail et le monétiser sans intermédiaire. Fondé par un collectif de beatmakers passionnés, le projet a démarré comme un échange informel de fichiers entre amis avant de prendre la forme d'une véritable marketplace.",
  },
  {
    title: "La mission",
    content:
      "Notre mission est de connecter les artistes qui cherchent des instrumentales de qualité avec les producteurs qui les créent. Chaque beat disponible sur la plateforme est le fruit d'un travail artisanal : arrangement, mixage, sound design — rien n'est généré automatiquement. Nous croyons à l'authenticité de la création musicale.",
  },
  {
    title: "La communauté",
    content:
      "Au fil des années, Beatmakerz est devenu bien plus qu'une boutique en ligne. C'est une communauté de producteurs, de rappeurs, de chanteurs et d'ingénieurs du son qui partagent les mêmes valeurs : l'exigence, la créativité et le respect du travail des autres. Les collaborations entre membres ont donné naissance à des projets qui dépassent largement le cadre de la plateforme.",
  },
  {
    title: "Aujourd'hui",
    content:
      "Beatmakerz continue de grandir avec une sélection de beats en constante évolution, des licences adaptées à tous les projets — des créations personnelles aux sorties commerciales — et des outils pensés pour simplifier la vie des artistes. L'aventure ne fait que commencer.",
  },
];
