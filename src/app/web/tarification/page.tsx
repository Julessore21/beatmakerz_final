"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Tarification() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <h1 className="text-4xl font-bold tracking-tight">Tarification</h1>
          <p className="mt-1 text-sm text-zinc-400">Abonnements et tarifs clairs</p>
        </motion.div>

        <div className="mt-8 space-y-6">
          <Section
            title="Tarifs des instrumentales"
            items={[
              "Instrumentale à l'unité : 9,99€",
              "Instrumentale sur mesure : 59,99€",
              "Instrumentales via l'abonnement : incluses",
            ]}
            description="Une sélection d'instrumentales de haute qualité, prêtes à utiliser ou personnalisables."
          />

          <SubscriptionSection
            name="Infini"
            price="19,99€ / mois"
            annual="209,99€ / an"
            benefits={["3 prods par mois + 1 offerte", "Téléchargement instantané", "20€ d'économie par mois"]}
          />

          <SubscriptionSection
            name="Infini +"
            price="39,99€ / mois"
            annual="409,99€ / an"
            benefits={[
              "8 prods par mois + 2 offertes",
              "Téléchargement instantané",
              "Support prioritaire",
              "15% sur les prods sur mesure",
              "60€ d'économie par mois",
            ]}
          />

          <SubscriptionSection
            name="Infini X"
            price="59,99€ / mois"
            annual="599,99€ / an"
            benefits={[
              "12 prods par mois + 3 offertes",
              "Téléchargement instantané",
              "Support prioritaire",
              "30% sur les prods sur mesure",
              "90€ d'économie par mois",
            ]}
          />
        </div>

        <div className="text-center mt-5 text-xs md:text-sm text-neutral-400">
          <Link href="/web/faq#tarifs" className="underline hover:text-white">
            En savoir plus sur la tarification
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-zinc-300">{description}</p>
      <ul className="mt-2 list-disc list-inside text-sm text-zinc-300 space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function SubscriptionSection({
  name,
  price,
  annual,
  benefits,
}: {
  name: string;
  price: string;
  annual: string;
  benefits: string[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <h2 className="text-lg font-semibold">Abonnement {name}</h2>
      <p className="mt-2 text-sm text-zinc-300">Pour les artistes qui veulent un forfait clair et immédiat.</p>
      <p className="mt-2 text-sm font-semibold">Mensuel : {price}</p>
      <p className="text-sm text-zinc-300">Annuel : {annual}</p>
      <p className="mt-1 text-sm text-zinc-300">Avantages inclus :</p>
      <ul className="mt-2 list-disc list-inside text-sm text-zinc-300 space-y-1">
        {benefits.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm font-semibold">Comment souscrire ?</p>
      <ol className="mt-1 list-decimal list-inside text-sm text-zinc-300 space-y-1">
        <li>Crée un compte utilisateur.</li>
        <li>Va dans la section Abonnements.</li>
        <li>Sélectionne {name} et valide ton paiement.</li>
      </ol>
      <p className="mt-3 text-sm font-semibold">Conditions</p>
      <ul className="mt-1 list-disc list-inside text-sm text-zinc-300 space-y-1">
        <li>Facturation mensuelle ou annuelle.</li>
        <li>Résiliation possible à tout moment pour le terme en cours.</li>
        <li>Avantages actifs jusqu'à la fin de la période en cours après résiliation.</li>
      </ul>
    </section>
  );
}
