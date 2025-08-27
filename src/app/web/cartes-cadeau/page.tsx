"use client";

import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";

type Plan = {
  id: string; // "20" | "40" | "60" | "autre"
  name: string;
  displayPrice: string; // ex: "20 €"
  label?: string;
  description: string[];
  subTitle?: string;
};

const plans: Plan[] = [
  {
    id: "20",
    name: "CARTE CADEAU",
    displayPrice: "20 €",
    label: "",
    description: [
      "✔️ Valable sur tout le site",
      "✔️ Réduction immédiate",
      "✔️ E-carte personnalisable",
    ],
  },
  {
    id: "40",
    name: "CARTE CADEAU",
    displayPrice: "40 €",
    label: "",
    description: [
      "✔️ Valable sur tout le site",
      "✔️ Réduction immédiate",
      "✔️ E-carte personnalisable",
    ],
  },
  {
    id: "60",
    name: "CARTE CADEAU",
    displayPrice: "60 €",
    label: "",
    description: [
      "✔️ Valable sur tout le site",
      "✔️ Réduction immédiate",
      "✔️ E-carte personnalisable",
    ],
  },
  {
    id: "autre",
    name: "AUTRE",
    displayPrice: "€",
    label: "",
    description: [
      "✔️ Valable sur tout le site",
      "✔️ Réduction immédiate",
      "✔️ E-carte personnalisable",
    ],
  },
];

const CartesCadeau: React.FC = () => {
  // Toggle POUR MOI / POUR OFFRIR
  const [isPourMoi, setIsPourMoi] = useState<boolean>(true);
  // Sélection de carte
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  // Valeur personnalisée “AUTRE”
  const [customValue, setCustomValue] = useState<string>("");
  // Modal “POUR OFFRIR”
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalPlan, setModalPlan] = useState<Plan | null>(null);
  const [personalMessage, setPersonalMessage] = useState<string>("");

  // Position du slider
  const sliderLeft = isPourMoi ? "4px" : "104px";

  // Prix affiché
  const getDisplayPrice = (plan: Plan): string => {
    if (plan.id !== "autre") return plan.displayPrice;
    return customValue ? `${customValue} €` : "Saisir un montant";
  };

  // Achat
  const handleAcheter = (plan: Plan) => {
    if (!isPourMoi) {
      setModalPlan(plan);
      setShowModal(true);
    } else {
      alert(`Commande passée pour : ${getDisplayPrice(plan)}`);
    }
  };

  const onCustomValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomValue(e.target.value);
  };

  const onCustomValueKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 pt-20 pb-12 flex flex-col items-center">
      {/* Titre principal */}
      <h1 className="text-center text-2xl md:text-3xl font-bold mb-2 mt-6">
        CHOISIS TA CARTE CADEAU
      </h1>
      <p className="text-sm md:text-base text-neutral-400 mb-4 text-center">
        Offre ou procure-toi une carte cadeau valable sur tout le site !
      </p>

      {/* Toggle */}
      <div className="relative flex items-center justify-center w-[220px] h-12 border border-white rounded-full bg-transparent mb-10">
        <motion.div
          className="absolute top-1 bottom-1 w-1/2 rounded-full bg-[#401a87]"
          animate={{ left: sliderLeft }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <button
          onClick={() => setIsPourMoi(true)}
          className="relative z-10 w-1/2 text-sm font-semibold text-center transition-colors text-white"
        >
          POUR MOI
        </button>
        <button
          onClick={() => setIsPourMoi(false)}
          className="relative z-10 w-1/2 text-sm font-semibold text-center transition-colors text-white"
        >
          POUR OFFRIR
        </button>
      </div>

      {/* Cartes */}
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-6">
        {plans.map((plan) => {
          const borderClass =
            selectedPlan === plan.id ? "border-white" : "border-neutral-700";
          return (
            <motion.div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative flex flex-col items-center text-center w-full md:w-[250px] h-[400px] bg-black cursor-pointer ${borderClass} border rounded-lg p-6 hover:shadow-xl hover:-translate-y-4 transition-transform transition-shadow duration-300`}
              whileTap={{ scale: 0.97 }}
            >
              {plan.label ? (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-[#401a87] text-white text-[10px] font-semibold uppercase">
                  {plan.label}
                </div>
              ) : null}

              <h2 className="text-lg font-bold mb-1 mt-4 text-center">
                {plan.name}
              </h2>
              {plan.subTitle ? (
                <p className="text-xs text-neutral-400 text-center">
                  {plan.subTitle}
                </p>
              ) : null}

              <div className="mb-3">
                {plan.id !== "autre" ? (
                  <p className="text-4xl font-extrabold text-center">
                    {getDisplayPrice(plan)}
                  </p>
                ) : (
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      className="bg-black text-center text-4xl font-extrabold border-b border-gray-500 w-[100px] focus:outline-none focus:border-white"
                      value={customValue}
                      onChange={onCustomValueChange}
                      onKeyDown={onCustomValueKeyDown}
                    />
                    <span className="ml-1 text-4xl font-extrabold">€</span>
                  </div>
                )}
              </div>

              <ul className="text-xs text-neutral-300 space-y-2 flex-1 mb-3 leading-relaxed text-center">
                {plan.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcheter(plan);
                }}
                className="mt-auto py-2 px-4 rounded-full border-2 font-semibold text-sm transition-colors border-neutral-600 text-neutral-200 hover:bg-[#401a87] hover:border-[#401a87] hover:text-white active:bg-[#401a87] active:border-[#401a87] active:text-white"
              >
                Acheter
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-8 text-xs md:text-sm text-neutral-400">
        La carte cadeau idéale pour tous les passionnés de musique !
      </div>

      {/* Modal POUR OFFRIR */}
      {showModal && modalPlan && !isPourMoi && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-black border border-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Récapitulatif de votre commande
            </h2>

            <p className="mb-2 text-center">Carte: {modalPlan.name}</p>

            <p className="mb-2 text-center">
              Montant:{" "}
              {modalPlan.id !== "autre"
                ? modalPlan.displayPrice
                : customValue
                ? `${customValue} €`
                : "Saisir un montant"}
            </p>

            <textarea
              value={personalMessage}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setPersonalMessage(e.target.value)
              }
              placeholder="Ajouter un message personnalisé (optionnel)"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white mb-4"
              rows={4}
            />

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  alert("Commande confirmée !");
                  setShowModal(false);
                }}
                className="px-6 py-2 bg-[#2c1f57] border border-[#2c1f57] text-white rounded-full hover:bg-[#1d143a] transition-colors duration-300"
              >
                Confirmer
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-black border border-white text-white rounded-full hover:bg-gray-700 transition-colors duration-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartesCadeau;
