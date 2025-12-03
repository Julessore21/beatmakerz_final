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
            <h1 className="text-4xl font-bold tracking-tight">Politique de confidentialite</h1>
            <p className="mt-1 text-sm text-zinc-400">Comment nous collectons et protegeons vos donnees</p>
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
      "Bienvenue sur notre site de vente d'instrumentales. Nous prenons votre vie privee tres au serieux et nous nous engageons a proteger vos informations personnelles. Cette politique explique comment nous collectons, utilisons, divulguons et protegons vos informations lorsque vous visitez notre site et utilisez nos services.",
  },
  {
    title: "1. Collecte des informations",
    content: [
      "Informations personnelles : nom, email, adresse postale, telephone, paiement.",
      "Informations de navigation : adresse IP, navigateur, pages visitees, date et heure.",
      "Cookies et technologies similaires pour ameliorer votre experience.",
    ],
  },
  {
    title: "2. Utilisation des informations",
    content: ["Traiter vos achats", "Support client", "Communications promotionnelles", "Personnalisation et amelioration du site", "Obligations legales"],
  },
  {
    title: "3. Partage des informations",
    content: [
      "Fournisseurs de services (paiement, emailing) strictement necessaires",
      "Obligations legales ou protection de nos droits",
      "Transfert d'entreprise (fusion, acquisition, vente d'actifs)",
    ],
  },
  {
    title: "4. Protection des informations",
    content: "Mesures techniques et organisationnelles (chiffrement, controle d'acces, audits) pour proteger vos donnees.",
  },
  {
    title: "5. Vos droits",
    content: ["Acces, rectification, suppression", "Opposition ou limitation", "Portabilite", "Retrait du consentement", "Reclamation CNIL"],
  },
  {
    title: "6. Conservation",
    content: "Les donnees sont conservees aussi longtemps que necessaire pour les finalites prevues ou pour respecter les obligations legales.",
  },
  {
    title: "7. Cookies",
    content: ["Cookies essentiels (securite, paiement)", "Cookies analytics", "Gestion via les reglages navigateur et notre bannière le cas echeant"],
  },
  {
    title: "8. Contact",
    content: ["Email : support@beatmakerz.fr", "Adresse : Beatmakerz, 10 rue des Prods, 75000 Paris"],
  },
];
