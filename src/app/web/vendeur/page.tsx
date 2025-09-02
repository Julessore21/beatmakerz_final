"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Mets tes prods en avant",
    text: "Pages profil modernes, player intégré, favoris et partages.",
  },
  {
    title: "Seulement 15% de commission",
    text: "Tu gardes 85% sur chaque vente. Paiements rapides et transparents.",
  },
  {
    title: "Outils marketing",
    text: "Codes promo, bundles, mise en avant sur la marketplace.",
  },
  {
    title: "Protection & licences",
    text: "Préécoute protégée, modèles de licences, suivi des téléchargements.",
  },
  {
    title: "Statistiques avancées",
    text: "Ventes, revenus, tendances, sources de trafic – tout est clair.",
  },
  {
    title: "Support prioritaire",
    text: "On t’accompagne pour optimiser tes sorties et tes ventes.",
  },
];

export default function VendeurLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-5xl px-4 min-h-[calc(100vh-8rem)] flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <h1 className="text-3xl font-bold tracking-tight">Vends tes prods sur Beatmakerz</h1>
          <p className="mt-2 text-sm text-zinc-300">Une plateforme pensée pour les beatmakers, simple, rapide et lucrative.</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 text-left">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-base font-semibold">{f.title}</div>
                <div className="mt-1 text-sm text-zinc-300">{f.text}</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="/web/vendeur/onboarding"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Commencer maintenant
            </a>
          </div>
          <p className="mt-6 text-xs text-zinc-500">15% de commission • Paiements sécurisés • Sans engagement</p>
        </motion.div>
      </div>
    </div>
  );
}


