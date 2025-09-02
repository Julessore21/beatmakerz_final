"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function OnboardingVendeur() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-3xl px-4 min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <h1 className="text-3xl font-bold tracking-tight">Devenir vendeur</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Rejoins Beatmakerz Pro et commence à vendre tes instrumentales en quelques minutes.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
            {[
              {
                title: "Mise en ligne rapide",
                text: "Ajoute tes prods en 2 clics, titres, tags et préécoute intégrée.",
              },
              {
                title: "Paiements sécurisés",
                text: "Encaissement automatique, historique des ventes et factures.",
              },
              {
                title: "Stats détaillées",
                text: "Vues, favoris, conversions et revenus par période.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="text-base font-semibold">{c.title}</div>
                <div className="mt-1 text-sm text-zinc-300">{c.text}</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/web/vendeur"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Devenir vendeur
            </Link>
          </div>

          <p className="mt-6 text-xs text-zinc-500">Aucun frais caché • Sans engagement • Assistance prioritaire</p>
        </motion.div>
      </div>
    </div>
  );
}
