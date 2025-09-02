'use client';
// src/app/web/tarification/page.tsx
import React from "react";
import { motion } from "framer-motion";

export default function Tarification() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        {/* En-tête aligné sur FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <h1 className="text-4xl font-bold tracking-tight">Tarification</h1>
          <p className="mt-1 text-sm text-zinc-400">Abonnements et tarifs clairs</p>
        </motion.div>

        <div className="mt-8 space-y-6">

        {/* SECTION 1 : TARIFS UNITAIRES */}
        <Section
          title="Tarifs Des Instrumentales"
          items={[
            "Instrumentale à l\'unité : 9,99€",
            "Instrumentale sur mesure : 59,99€",
            "Instrumentales via l\'abonnement : sans coût supplémentaire",
          ]}
          description="Nous proposons une large gamme d\'instrumentales de haute qualité adaptées à différents styles musicaux."
        />

        {/* SECTION 2 : INFINI */}
        <SubscriptionSection
          name="Infini"
          price="19,99€ / mois"
          annual="209,99€ / an"
          benefits={[
            "3 prods par mois + 1 offerte",
            "Téléchargement instantané",
            "20€ d\'économie par mois",
          ]}
          reduction={null}
        />

        {/* SECTION 3 : INFINI + */}
        <SubscriptionSection
          name="Infini +"
          price="39,99€ / mois"
          annual="409,99€ / an"
          benefits={[
            "8 prods par mois + 2 offertes",
            "Téléchargement instantané",
            "Support prioritaire",
            "15% de réduction sur les prods sur mesure",
            "60€ d\'économie par mois",
          ]}
        />

        {/* SECTION 4 : INFINI X */}
        <SubscriptionSection
          name="Infini X"
          price="59,99€ / mois"
          annual="599,99€ / an"
          benefits={[
            "12 prods par mois + 3 offertes",
            "Téléchargement instantané",
            "Support prioritaire",
            "30% de réduction sur les prods sur mesure",
            "90€ d\'économie par mois",
          ]}
        />
        </div>
      </div>
    </div>
  );
}

// 🔧 Composant Section générique
function Section({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
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

// 🔧 Composant Section abonnement
function SubscriptionSection({
  name,
  price,
  annual,
  benefits,
  reduction,
}: {
  name: string;
  price: string;
  annual: string;
  benefits: string[];
  reduction?: string | null;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <h2 className="text-lg font-semibold">Abonnement Mensuel &apos;{name}&apos;</h2>
      <p className="mt-2 text-sm text-zinc-300">
        Pour les artistes qui souhaitent bénéficier de tarifs avantageux, nous offrons un abonnement mensuel appelé &apos;{name}&apos;.
      </p>
      <p className="mt-2 text-sm font-semibold">– Abonnement mensuel &apos;{name}&apos; : {price}</p>
      <p className="mt-1 text-sm text-zinc-300">Avantages inclus :</p>
      <ul className="mt-2 list-disc list-inside text-sm text-zinc-300 space-y-1">
        {benefits.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm font-semibold">Comment souscrire ?</p>
      <ol className="mt-1 list-decimal list-inside text-sm text-zinc-300 space-y-1">
        <li>Créez un compte utilisateur sur notre site.</li>
        <li>Accédez à la section Abonnement de votre compte.</li>
        <li>Sélectionnez l&apos;option &apos;{name}&apos; et suivez les instructions pour compléter votre abonnement.</li>
      </ol>
      <p className="mt-3 text-sm font-semibold">Conditions</p>
      <ul className="mt-1 list-disc list-inside text-sm text-zinc-300 space-y-1">
        <li>L&apos;abonnement &apos;{name}&apos; est facturé mensuellement {price} ou annuellement {annual}.</li>
        <li>Vous pouvez annuler votre abonnement à tout moment depuis votre profil ou par email (beatmakerz.contact@gmail.com).</li>
        <li>En cas d&apos;annulation, les avantages restent actifs jusqu&apos;à la fin de la période de facturation en cours.</li>
      </ul>
    </section>
  );
}
