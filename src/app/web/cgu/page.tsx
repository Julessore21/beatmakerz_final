"use client";

import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function CGU() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <h1 className="text-4xl font-bold tracking-tight">C.G.U</h1>
          <p className="mt-1 text-sm text-zinc-400">Conditions générales d’utilisation</p>
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
    <Footer />
    </>
  );
}

const sections: {
  title: string;
  content: string | string[];
}[] = [
  {
    title: "Introduction",
    content:
      "Bienvenue sur notre site de vente d'instrumentales. En utilisant notre site et nos services, vous acceptez de vous conformer aux présentes Conditions Générales d'Utilisation (CGU). Veuillez lire attentivement ces conditions avant d'utiliser notre site.",
  },
  {
    title: "1. Acceptation des Conditions",
    content:
      "En accédant à notre site et en utilisant nos services, vous acceptez d'être lié par ces CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.",
  },
  {
    title: "2. Modifications des CGU",
    content:
      "Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications seront effectives dès leur publication sur notre site. Il vous incombe de consulter régulièrement ces CGU pour prendre connaissance des éventuelles modifications.",
  },
  {
    title: "3. Utilisation du Site",
    content: [
      "Utiliser notre site d'une manière qui pourrait endommager, désactiver, surcharger ou altérer nos serveurs ou réseaux.",
      "Tenter d'accéder sans autorisation à nos systèmes ou réseaux.",
      "Interférer avec l'utilisation et la jouissance de notre site par d'autres utilisateurs.",
    ],
  },
  {
    title: "4. Comptes Utilisateur",
    content:
      "Pour accéder à certaines fonctionnalités de notre site, vous devez créer un compte utilisateur. Vous acceptez de fournir des informations exactes et complètes lors de la création de votre compte et de les mettre à jour en cas de changement. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte.",
  },
  {
    title: "5. Achats et Paiements",
    content:
      "Toutes les commandes passées sur notre site sont soumises à notre acceptation. Nous nous réservons le droit de refuser ou d'annuler toute commande pour quelque raison que ce soit. Les prix des produits et services sont susceptibles de changer sans préavis.",
  },
  {
    title: "6. Licences et Droits d'Utilisation",
    content:
      "Lorsque vous achetez une instrumentale sur notre site, vous obtenez une licence pour utiliser cette instrumentale conformément aux termes de la licence achetée. Vous acceptez de respecter toutes les restrictions et conditions associées à la licence. Vous n'avez pas le droit de revendre, redistribuer ou transférer la licence à des tiers sans notre autorisation écrite préalable.",
  },
  {
    title: "7. Propriété Intellectuelle",
    content:
      "Tous les contenus disponibles sur notre site, y compris, mais sans s'y limiter, les textes, graphiques, logos, images et clips audio, sont la propriété de notre entreprise ou de nos fournisseurs de contenu et sont protégés par les lois sur la propriété intellectuelle. Vous acceptez de ne pas copier, reproduire, distribuer ou créer des œuvres dérivées de ces contenus sans notre autorisation écrite préalable.",
  },
  {
    title: "8. Limitation de Responsabilité",
    content:
      "Dans la mesure permise par la loi, nous ne serons pas responsables des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de votre utilisation de notre site ou de nos services. Nous ne garantissons pas que notre site sera ininterrompu ou exempt d'erreurs.",
  },
  {
    title: "9. Indemnisation",
    content:
      "Vous acceptez de nous indemniser, de nous défendre et de nous dégager de toute responsabilité en cas de réclamations, dommages, pertes, coûts ou dépenses (y compris les frais d'avocat raisonnables) résultant de votre utilisation de notre site ou de la violation de ces CGU.",
  },
  {
    title: "10. Résiliation",
    content:
      "Nous nous réservons le droit de suspendre ou de résilier votre compte et votre accès à notre site à tout moment, sans préavis, en cas de violation de ces CGU ou pour toute autre raison à notre seule discrétion.",
  },
  {
    title: "11. Protection des Données",
    content:
      "Vos informations personnelles sont collectées et traitées conformément à notre politique de confidentialité. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.",
  },
  {
    title: "12. Contact",
    content:
      "Pour toute question ou demande, veuillez nous contacter à : beatmakerz.contact@gmail.com",
  },
];
