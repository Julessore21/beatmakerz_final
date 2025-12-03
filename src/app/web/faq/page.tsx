"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]"
        >
          <h1 className="text-4xl font-bold tracking-tight">F.A.Q</h1>
          <p className="mt-1 text-sm text-zinc-400">Questions fréquentes et réponses rapides</p>
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
    title:
      "1. Une fois mon achat effectué, en combien de temps est-il délivré ?",
    content:
      "Une fois votre achat effectué sur le site, notre émetteur de paiement vérifiera que tout est en règle et vous recevrez votre instrumentale sous la forme d'un fichier MP3 ou au format WAV (sur demande).",
  },
  {
    title:
      "2. Quelle est la licence que j'obtiens une fois mon achat effectué ?",
    content: [
      "Achat classique (abonnement / prod à l'unité) : licence non exclusive. Vous pouvez utiliser l'instrumentale à des fins commerciales.",
      "Prod sur mesure : licence exclusive unique. Vous pouvez l'utiliser à des fins commerciales et elle ne sera ni revendue ni remise en vente sur le site.",
    ],
  },
  {
    title:
      '3. Comment fonctionnent les abonnements "Infini", "Infini +" & "Infini X" ?',
    content: [
      "Infini : 14,99€/mois → jusqu'à 4 prods/mois sans coûts supplémentaires (3 + 1 offerte).",
      "Infini + : 29,99€/mois → jusqu'à 10 prods/mois sans coûts supplémentaires (8 + 2 offertes).",
      "Infini X : 59,99€/mois → jusqu'à 15 prods/mois sans coûts supplémentaires (12 + 3 offertes).",
    ],
  },
  {
    title: "4. Comment fonctionne le service de prod sur mesure ?",
    content:
      "Le service de prod sur mesure permet d'obtenir une instrumentale exclusive personnalisée pour 59,99€. Après vérification du paiement, vous recevez un contrat de cession SACEM et une licence exclusive. L'instrumentale n'est pas remise en vente sur le site.",
  },
  {
    title: "5. Comment annuler mon abonnement ?",
    content:
      'Depuis votre profil, rubrique "Mon abonnement". Vous pouvez annuler à tout moment si le service ne vous convient plus.',
  },
  {
    title: "6. Quels sont les modes de paiement acceptés ?",
    content:
      "Carte de crédit (Visa, MasterCard, American Express), PayPal, et autres paiements en ligne sécurisés.",
  },
  {
    title: "7. Puis-je écouter un extrait avant d'acheter une instrumentale ?",
    content:
      "Oui. Un extrait de 1min30 est disponible sur chaque instrumentale, et les versions complètes sont aussi sur notre chaîne YouTube.",
  },
  {
    title: "8. Est-ce que les instrumentales sont exclusives ?",
    content:
      "Nous proposons des licences exclusives et non exclusives. Les exclusives vous donnent des droits complets et retirent l'instrumentale de la vente.",
  },
  {
    title:
      "9. Que se passe-t-il si je rencontre un problème technique avec le téléchargement ?",
    content:
      "Contactez-nous à beatmakerz.contact@gmail.com — le support vous aidera rapidement à résoudre le problème.",
  },
  {
    title: "10. Puis-je obtenir un remboursement après l'achat ?",
    content:
      "Les remboursements ne sont pas proposés en général pour les produits numériques, sauf problème technique avéré avec le fichier. Écrivez à beatmakerz.contact@gmail.com.",
  },
  {
    title:
      "11. Puis-je utiliser les instrumentales pour des performances en direct ?",
    content:
      "Oui, selon les termes de la licence achetée. Référez-vous à votre licence pour les restrictions et permissions.",
  },
  {
    title: "12. Comment puis-je contacter le support client ?",
    content:
      "Par email à beatmakerz.contact@gmail.com. Nous répondons généralement sous 24h.",
  },
  {
    title: "13. Y a-t-il des réductions pour les achats en gros ?",
    content:
      "Non, nous n'offrons pas de réductions pour les achats en gros. Pour toute question, écrivez à beatmakerz.contact@gmail.com.",
  },
];
