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
    <div className="min-h-screen bg-black text-white px-4 pt-20 pb-12 flex flex-col items-center">
      <h1 className="text-center text-2xl md:text-3xl font-bold mt-8">
        Choisis l’abonnement infini adapté à tes besoins
      </h1>
      <p className="text-sm md:text-base text-neutral-400 mb-5 text-center">
        Donne-toi enfin les moyens de réussir dans la musique !
      </p>

      <div className="relative flex items-center justify-center w-[220px] h-12 border border-white rounded-full bg-transparent mb-10">
        <motion.div
          className="absolute top-1 bottom-1 w-1/2 rounded-full bg-[#401a87]"
          animate={{ left: isMensuel ? "4px" : "106px" }}
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

      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-6">
        {plans.map((plan, idx) => {
          const monthlyPrice = parsePrice(plan.monthly);
          const yearlyPrice = parsePrice(plan.yearly);
          const totalMensuel = monthlyPrice * 12;
          const discount = Math.round(
            ((totalMensuel - yearlyPrice) / totalMensuel) * 100
          );

          let borderClass = "border-neutral-700";
          if (selectedPlan === plan.name) {
            borderClass = "border-white";
          } else if (plan.name === "INFINI X") {
            borderClass = "border-[#401a87]";
          }

          return (
            <motion.div
              key={idx}
              onClick={() => setSelectedPlan(plan.name)}
              className={`
                relative flex flex-col items-center text-center
                w-full md:w-[250px] h-[410px] bg-black cursor-pointer
                ${borderClass} border rounded-lg p-6 hover:shadow-xl hover:-translate-y-4 transition-transform duration-300
              `}
              whileTap={{ scale: 0.97 }}
            >
              {plan.label && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-[#401a87] text-white text-[10px] font-semibold uppercase">
                  {plan.label}
                </div>
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

              <hr className="border-neutral-700 w-full mb-3" />

              <ul className="text-xs text-neutral-300 space-y-2 flex-1 mb-3 leading-relaxed">
                {plan.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>

              <button
                className="
                  mt-auto py-2 px-4 rounded-full border-2 font-semibold text-sm transition-colors
                  border-neutral-600 text-neutral-200 hover:bg-[#401a87] hover:border-[#401a87] hover:text-white
                  active:bg-[#401a87] active:border-[#401a87] active:text-white
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
