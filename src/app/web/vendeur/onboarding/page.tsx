"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function VendorOnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-40">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/30 to-indigo-300/20 p-6 shadow-xl">
          <div className="text-2xl font-bold">Devenir vendeur</div>
          <div className="mt-1 text-sm text-zinc-300">
            Crée ton espace, ajoute tes prods et commence à vendre sur Beatmakerz.
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#241e33]/60 to-[#161522]/60 p-5">
            <div className="text-sm font-semibold">1. Créer ton compte vendeur</div>
            <p className="mt-2 text-sm text-zinc-300">
              Renseigne ton nom d’artiste, ta photo et tes spécialités.
            </p>
            <Link href="#" className="mt-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
              Continuer
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#241e33]/60 to-[#161522]/60 p-5">
            <div className="text-sm font-semibold">2. Connecter le paiement</div>
            <p className="mt-2 text-sm text-zinc-300">
              Connecte ton compte pour recevoir tes revenus en toute sécurité.
            </p>
            <Link href="#" className="mt-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
              Configurer
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#241e33]/60 to-[#161522]/60 p-5">
            <div className="text-sm font-semibold">3. Mettre en ligne des prods</div>
            <p className="mt-2 text-sm text-zinc-300">
              Uploade tes instrumentales, fixe ton prix et publie.
            </p>
            <Link href="#" className="mt-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
              Ajouter une prod
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-zinc-300">
          En t’inscrivant, tu acceptes nos
          {" "}
          <Link href="/web/cgu" className="underline hover:text-white">CGU</Link> et notre
          {" "}
          <Link href="/web/cgv" className="underline hover:text-white">CGV</Link>.
        </div>
      </motion.div>
    </div>
  );
}


