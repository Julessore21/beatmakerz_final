"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { easeInOut } from "framer-motion";

type Step = {
  id: number;
  stepName: string;
  progress: "0%" | "50%" | "100%";
  title: string;
  content: string;
};

const stepsData: Step[] = [
  {
    id: 1,
    stepName: "ÉTAPE 1",
    progress: "0%",
    title: "Définis ton beat ideal",
    content:
      "Fait nous part de tes envies en étant le plus conçis possible sur ce que tu veux, un bpm, un sample, un instrument, un style en particulier ? la seule limite est ton imagination",
  },
  {
    id: 2,
    stepName: "ÉTAPE 2",
    progress: "50%",
    title: "Développement & Retour ",
    content:
      "Nous conçevons l'instrumentale selon tes directives et te faisons un retour sous 24 heures d'une première version, notre système de révision illimitées te permet de nous faire un retour sur les élements que tu aimerais ajuster",
  },
  {
    id: 3,
    stepName: "ÉTAPE 3",
    progress: "100%",
    title: "Livraison Finale",
    content:
      "Après ta validation, ta production est finalisée et livrée sous format (wav) maintenant à toi de l'utiliser comme tu l'entends ! ",
  },
];

const fillMapping: Record<number, number> = {
  1: 33,
  2: 66,
  3: 100,
};

function getProgressColor(progress: Step["progress"]) {
  if (progress === "0%") return "text-red-500";
  if (progress === "50%") return "text-orange-500";
  if (progress === "100%") return "text-green-500";
  return "text-white";
}

export default function ProdSurMesure() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  const handleStepVisibility = useCallback((id: number, visible: boolean) => {
    setVisibleSteps((prev) =>
      visible
        ? [...new Set([...prev, id])]
        : prev.filter((stepId) => stepId !== id)
    );
  }, []);

  const currentFill =
    visibleSteps.length > 0
      ? Math.max(...visibleSteps.map((id) => fillMapping[id] || 0))
      : 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-24 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 uppercase text-center">
        OBTIENT TA PROD SUR MESURE
      </h1>
      <h2 className="text-3xl md:text-2xl font-bold mb-8 uppercase text-center">
        en 3 étapes simples
      </h2>
      <h2 className="text-3xl md:text-1xl font-bold mb-8 uppercase text-center">
        DECOUVRE LE PROCESSUS BEATMAKERZ
      </h2>

      <div className="relative w-full max-w-4xl mx-auto min-h-[80vh]">
        <div className="absolute left-0 top-12 bottom-0 w-1 bg-gray-800 rounded" />
        <motion.div
          className="absolute left-0 top-12 w-1 bg-[#401a87] rounded"
          style={{ height: `${currentFill}%` }}
          initial={{ height: 0 }}
          animate={{ height: `${currentFill}%` }}
          transition={{ duration: 0.6, ease: easeInOut }}
        />

        <div className="space-y-48 mt-10 ml-2">
          {stepsData.map((step) => (
            <StepRow
              key={step.id}
              step={step}
              onVisibility={handleStepVisibility}
            />
          ))}
        </div>
      </div>

      <div className="mt-20">
        <Link href="/web/commandeprod">
          <button className="px-8 py-4 bg-black border border-white text-white font-bold uppercase rounded-full hover:bg-[#2c1f57] hover:border-[#2c1f57] transition-colors duration-300">
            commander ma prod personnalisée
          </button>
        </Link>
      </div>
    </div>
  );
}

type StepRowProps = {
  step: Step;
  onVisibility: (id: number, visible: boolean) => void;
};

function StepRow({ step, onVisibility }: StepRowProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });

  useEffect(() => {
    onVisibility(step.id, inView);
  }, [inView, step.id, onVisibility]);

  return (
    <div
      ref={ref}
      className="relative flex flex-row items-center space-x-10 ml-0"
    >
      <motion.div
        className="w-3 h-3 bg-[#401a87] rounded-full ml-1"
        initial={{ scale: 0 }}
        animate={{ scale: inView ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.p
        className="text-2xl uppercase font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {step.stepName}
      </motion.p>
      <AnimatePresence>{inView && <StepCard step={step} />}</AnimatePresence>
    </div>
  );
}

function StepCard({ step }: { step: Step }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: easeInOut },
    },
    exit: {
      opacity: 0,
      y: 40,
      transition: { duration: 1, ease: easeInOut },
    },
  };

  return (
    <motion.div
      layout
      className="relative bg-black border border-white rounded-[20px] shadow-lg p-8 max-w-lg w-full mx-auto text-center"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2 className="text-4xl font-bold uppercase mb-4">{step.title}</h2>
      <p className="text-lg text-gray-300 leading-relaxed mb-8">
        {step.content}
      </p>
      <div className="mt-4">
        <p className={`text-5xl font-bold ${getProgressColor(step.progress)}`}>
          {step.progress}
        </p>
      </div>
    </motion.div>
  );
}
