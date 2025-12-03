"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CGV() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <h1 className="text-4xl font-bold tracking-tight">C.G.V</h1>
          <p className="mt-1 text-sm text-zinc-400">Conditions générales de vente</p>
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
    </>
  );
}

const sections: {
  title: string;
  content: string | string[];
}[] = [
  {
    title: "Préambule",
    content:
      "Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les transactions effectuées sur le site de vente d'instrumentales [BEATMAKERZ.FR]. En passant commande sur notre site, vous acceptez sans réserve les présentes conditions.",
  },
  {
    title: "1. Identité de l'entreprise",
    content: [
      "Beatmakerz",
      "ASSOCIATION D ENTREPRENEURS",
      "Contact : beatmakerz.contact@gmail.com",
    ],
  },
  {
    title: "2. Produits et Services",
    content:
      "Nous proposons à la vente des instrumentales de musique en format numérique (fichiers WAV et MP3). Chaque instrumental est décrit sur une page dédiée avec ses caractéristiques (titre, durée, BPM, etc.).",
  },
  {
    title: "3. Prix",
    content: [
      "Les prix de nos instrumentales sont indiqués en euros (€) TTC. Nous nous réservons le droit de modifier les prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.",
      "Instrumentale à l'unité : 9,99€",
      "Abonnement mensuel 'Infini' : 14,99€/mois (4 prods incluses)",
      "Abonnement mensuel 'Infini +' : 29,99€/mois (10 prods incluses)",
      "Prod sur-mesure : 49,99€",
    ],
  },
  {
    title: "4. Commande",
    content:
      "Pour passer commande, vous devez créer un compte utilisateur sur notre site. Une fois votre panier validé, vous serez redirigé vers la page de paiement.",
  },
  {
    title: "5. Paiement",
    content:
      "Le paiement s'effectue en ligne par carte bancaire ou via PayPal. Nos transactions sont sécurisées par [nom du prestataire de paiement]. Après validation de votre paiement, notre système vérifiera votre transaction.",
  },
  {
    title: "6. Livraison des Instrumentales",
    content:
      "Une fois le paiement vérifié, vous recevrez immédiatement l'instrumentale achetée sous forme de fichier téléchargeable (MP3 et WAV sur demande) dans votre compte utilisateur.",
  },
  {
    title: "7. Droit de Rétractation",
    content:
      "Conformément à la législation, les produits numériques téléchargés instantanément après l'achat ne bénéficient pas du droit de rétractation.",
  },
  {
    title: "8. Garanties et Responsabilités",
    content:
      "Nous garantissons que les instrumentales sont libres de droits et peuvent être utilisées selon les termes de la licence achetée. Nous ne pouvons être tenus responsables des dommages indirects ou imprévisibles résultant de l'utilisation de notre site.",
  },
  {
    title: "9. Licence et Droits d'Utilisation",
    content: [
      "Licence non-exclusive : utilisation personnelle et commerciale autorisée. Revente interdite.",
      "Licence exclusive : droits exclusifs, l'instrumentale est retirée du site. Revente interdite.",
    ],
  },
  {
    title: "10. Résolution des Litiges",
    content:
      "En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. Les CGV sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents.",
  },
  {
    title: "11. Protection des Données",
    content:
      "Vos informations personnelles sont collectées et traitées conformément à notre politique de confidentialité. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
  },
  {
    title: "12. Contact",
    content:
      "Pour toute question ou demande, contactez-nous à : beatmakerz.contact@gmail.com",
  },
];
