"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

function Abonnements() {
  const [isMensuel, setIsMensuel] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");

  const plans = [
    {
      name: "INFINI",
      subTitle: "À partir de",
      monthly: "19.99€",
      yearly: "209.99€",
      label: "BASIQUE",
      description: [
        "✔️ 4 prods/mois",
        "✔️ 20€ d'économie",
        "✔️ 100% royalty free",
      ],
    },
    {
      name: "INFINI +",
      subTitle: "À partir de",
      monthly: "39.99€",
      yearly: "409.99€",
      label: "POPULAIRE",
      description: [
        "✔️ 10 prods/mois",
        "✔️ 60€ d'économie",
        "✔️ 100% royalty free",
        "✔️ -15 % (prods sur mesures)",
        "✔️ SAV PRIORITAIRE",
      ],
    },
    {
      name: "INFINI X",
      subTitle: "À partir de",
      monthly: "59.99€",
      yearly: "599.99€",
      label: "MEILLEURE OFFRE",
      description: [
        "✔️ 15 prods/mois",
        "✔️ 90€ d'économie",
        "✔️ 100% royalty free",
        "✔️ -30 % (prods sur mesures)",
        "✔️ SAV PRIORITAIRE",
      ],
    },
  ];

  const parsePrice = (priceStr: string) =>
    parseFloat(priceStr.replace("€", ""));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A12] text-white px-4 pt-24 pb-16 flex flex-col items-center">
      {/* Ambient animated background (même esprit que la page profil) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.2 }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute right-[-10rem] top-10 h-[28rem] w-[28rem] rounded-full bg-violet-700/30 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -10, 15, 0], y: [0, 12, -8, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-12rem] left-20 h-[26rem] w-[26rem] rounded-full bg-violet-900/25 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>
      <div className="w-full max-w-5xl text-center">
        <div className="rounded-3xl border border-white/10 bg-[#141416]/90 p-8 backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Choisis l’abonnement infini adapté à tes besoins
          </h1>
          <p className="mt-2 text-sm md:text-base text-neutral-400">
            Donne‑toi enfin les moyens de réussir dans la musique !
          </p>
        </div>
      </div>

      <div className="relative mt-8 flex items-center justify-center w-[260px] h-12 border border-white/10 rounded-full bg-[#141416]/90 overflow-hidden">
        <motion.div
          className="absolute top-1 bottom-1 w-1/2 rounded-full bg-[#401a87]"
          initial={false}
          animate={{ left: isMensuel ? 4 : 126 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <button
          onClick={() => setIsMensuel(true)}
          className="relative z-10 w-1/2 text-sm font-semibold text-center transition-colors text-white"
        >
          Mensuel
        </button>
        <button
          onClick={() => setIsMensuel(false)}
          className="relative z-10 w-1/2 text-sm font-semibold text-center transition-colors text-white"
        >
          Annuel
        </button>
      </div>

      <div className="mt-8 max-w-6xl w-full grid grid-cols-1 md:grid-cols-[repeat(3,250px)] gap-[24px] justify-center">
        {plans.map((plan, idx) => {
          const monthlyPrice = parsePrice(plan.monthly);
          const yearlyPrice = parsePrice(plan.yearly);
          const totalMensuel = monthlyPrice * 12;
          const discount = Math.round(
            ((totalMensuel - yearlyPrice) / totalMensuel) * 100
          );

          let borderClass = "border-white/15";
          if (selectedPlan === plan.name) {
            borderClass = "border-white/40";
          } else if (plan.name === "INFINI X") {
            borderClass = "border-[#401a87]";
          }

          return (
            <motion.div
              key={idx}
              onClick={() => setSelectedPlan(plan.name)}
              className={`
                relative flex flex-col items-center text-center cursor-pointer
                ${borderClass} border rounded-2xl p-6 bg-[#141416]/90 backdrop-blur-xl w-full h-[410px]
                hover:-translate-y-2 transition-transform duration-300 shadow-[0_10px_40px_rgba(0,0,0,.35)]
              `}
              whileTap={{ scale: 0.97 }}

            >
              {plan.label && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase
                  ${plan.label === "BASIQUE" ? "bg-[#141416] text-zinc-200 border border-white/10" : ""}
                  ${plan.label === "POPULAIRE" ? "bg-[#141416] text-zinc-200 border border-white/10" : ""}
                  ${plan.label === "MEILLEURE OFFRE" ? "bg-[#401a87] text-white" : ""}
                `}>{plan.label}</div>
              )}

              <h2 className="text-lg font-bold mb-1 mt-4">{plan.name}</h2>
              <p className="text-xs text-neutral-400">{plan.subTitle}</p>

              <div className="mb-3">
                <p className="text-2xl font-extrabold">
                  {isMensuel ? plan.monthly : plan.yearly}
                </p>
                <p className="text-xs text-neutral-400">
                  facturé {isMensuel ? "mensuellement" : "annuellement"}
                </p>
                {!isMensuel && (
                  <div className="mt-1 flex flex-col items-center gap-2">
                    <p className="text-sm text-neutral-400 line-through opacity-75">
                      {totalMensuel.toFixed(2)}€
                    </p>
                    <div className="inline-block px-2 py-1 rounded-full bg-[#401a87] text-white text-[10px] font-semibold">
                      {discount}% de réduction
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-white/10 w-full mb-3" />

              <ul className="text-xs text-neutral-300 space-y-2 flex-1 mb-3 leading-relaxed">
                {plan.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>

              <button
                className="
                  mt-auto py-2.5 px-5 rounded-full border font-semibold text-sm transition-colors
                  border-[#401a87] text-white hover:bg-[#401a87]
                "
              >
                S’abonner
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-5 text-xs md:text-sm text-neutral-400">
        en savoir plus sur la tarification
      </div>
    </div>
  );
}

export default Abonnements;
