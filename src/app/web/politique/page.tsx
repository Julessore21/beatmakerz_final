"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <h1 className="text-4xl font-bold tracking-tight">Politique de confidentialité</h1>
          <p className="mt-1 text-sm text-zinc-400">Comment nous collectons et protégeons vos données</p>
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
    title: "Introduction",
    content:
      "Bienvenue sur notre site de vente d'instrumentales. Nous prenons votre vie privée très au sérieux et nous nous engageons à protéger vos informations personnelles. Cette politique explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site et utilisez nos services.",
  },
  {
    title: "1. Collecte des Informations",
    content: [
      "Informations personnelles : nom, adresse email, adresse postale, numéro de téléphone, informations de paiement.",
      "Informations de navigation : adresse IP, type de navigateur, pages visitées, date et heure de la visite.",
      "Cookies et technologies similaires : utilisés pour améliorer votre expérience sur notre site.",
    ],
  },
  {
    title: "2. Utilisation des Informations",
    content: [
      "Traiter et gérer vos achats.",
      "Fournir un service client et une assistance technique.",
      "Envoyer des communications promotionnelles et informatives.",
      "Améliorer notre site et personnaliser votre expérience.",
      "Respecter les obligations légales et réglementaires.",
    ],
  },
  {
    title: "3. Partage des Informations",
    content: [
      "Fournisseurs de services : prestataires tiers (ex. processeurs de paiement) pour opérer le site et nos services.",
      "Obligations légales : si requis par la loi ou pour protéger nos droits.",
      "Transfert d'entreprise : en cas de fusion, acquisition ou vente d'actifs.",
    ],
  },
  {
    title: "4. Protection des Informations",
    content:
      "Nous mettons en œuvre des mesures de sécurité appropriées (chiffrement, pare-feu, contrôles d'accès) pour protéger vos informations contre l'accès, la divulgation, la modification ou la destruction non autorisés.",
  },
  {
    title: "5. Vos Droits",
    content: [
      "Accéder à vos informations personnelles.",
      "Demander la correction de vos informations.",
      "Demander la suppression de vos informations.",
      "Vous opposer à certains traitements.",
      "Demander la portabilité de vos informations.",
      "Pour exercer ces droits : beatmakerz.contact@gmail.com",
    ],
  },
  {
    title: "6. Cookies et Technologies Similaires",
    content:
      "Nous utilisons des cookies pour collecter des informations d'usage, améliorer nos services et personnaliser l'expérience. Vous pouvez gérer vos préférences via les réglages de votre navigateur.",
  },
  {
    title: "7. Modifications de la Politique de Confidentialité",
    content:
      "Nous pouvons modifier cette politique à tout moment. Les changements seront publiés sur le site avec mise à jour de la date de révision.",
  },
  {
    title: "8. Contact",
    content:
      "Pour toute question concernant cette politique, contactez-nous à : beatmakerz.contact@gmail.com",
  },
];
