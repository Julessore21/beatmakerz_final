"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";

type BillingCycle = "monthly" | "yearly";

type PlanDefinition = {
  name: string;
  subTitle: string;
  monthly: string;
  yearly: string;
  label: string;
  description: string[];
  lookupKeys: Partial<Record<BillingCycle, string>>;
};

const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    name: "INFINI",
    subTitle: "A partir de",
    monthly: "19.99 EUR",
    yearly: "209.99 EUR",
    label: "BASIQUE",
    description: ["4 prods/mois", "20 EUR d&#39;economie", "100% royalty free"],
    lookupKeys: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_LOOKUP_INFINI_MONTHLY,
      yearly: process.env.NEXT_PUBLIC_STRIPE_LOOKUP_INFINI_YEARLY,
    },
  },
  {
    name: "INFINI +",
    subTitle: "A partir de",
    monthly: "39.99 EUR",
    yearly: "409.99 EUR",
    label: "POPULAIRE",
    description: [
      "10 prods/mois",
      "60 EUR d&#39;economie",
      "100% royalty free",
      "-15 % (prods sur mesure)",
      "SAV prioritaire",
    ],
    lookupKeys: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_LOOKUP_INFINI_PLUS_MONTHLY,
      yearly: process.env.NEXT_PUBLIC_STRIPE_LOOKUP_INFINI_PLUS_YEARLY,
    },
  },
  {
    name: "INFINI X",
    subTitle: "A partir de",
    monthly: "59.99 EUR",
    yearly: "599.99 EUR",
    label: "MEILLEURE OFFRE",
    description: [
      "15 prods/mois",
      "90 EUR d&#39;economie",
      "100% royalty free",
      "-30 % (prods sur mesure)",
      "SAV prioritaire",
    ],
    lookupKeys: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_LOOKUP_INFINI_X_MONTHLY,
      yearly: process.env.NEXT_PUBLIC_STRIPE_LOOKUP_INFINI_X_YEARLY,
    },
  },
];

const parsePrice = (priceStr: string) =>
  Number.parseFloat(priceStr.replace(/[^0-9.]/g, ""));

function Abonnements() {
  const [isMensuel, setIsMensuel] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isManagingBilling, setIsManagingBilling] = useState(false);
  const searchParams = useSearchParams();

  const checkoutStatus =
    searchParams?.get("success") === "true"
      ? "success"
      : searchParams?.get("canceled") === "true"
        ? "canceled"
        : null;

  const sessionIdParam = searchParams?.get("session_id") ?? "";
  const billingCycle: BillingCycle = isMensuel ? "monthly" : "yearly";

  const handleSubscribe = useCallback(
    async (plan: PlanDefinition) => {
      const lookupKey = plan.lookupKeys[billingCycle];
      if (!lookupKey) {
        setFeedbackMessage(
          "Ce plan n&#39;est pas encore disponible. Contacte-nous pour plus d'informations."
        );
        return;
      }

      setSelectedPlan(plan.name);
      setProcessingPlan(plan.name);
      setFeedbackMessage(null);

      try {
        const response = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lookupKey, mode: "subscription" }),
        });
        const payload = (await response.json()) as { url?: string; error?: string };

        if (!response.ok || !payload.url) {
          throw new Error(payload.error || "Impossible de demarrer le paiement.");
        }

        window.location.href = payload.url;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Une erreur inattendue est survenue.";
        setFeedbackMessage(message);
      } finally {
        setProcessingPlan(null);
      }
    },
    [billingCycle]
  );

  const handleManageBilling = useCallback(async () => {
    if (!sessionIdParam) {
      setFeedbackMessage(
        "Impossible de retrouver la session Stripe pour le portail client."
      );
      return;
    }

    setIsManagingBilling(true);
    setFeedbackMessage(null);

    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdParam }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Impossible d&#39;ouvrir le portail client.");
      }

      window.location.href = payload.url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue.";
      setFeedbackMessage(message);
    } finally {
      setIsManagingBilling(false);
    }
  }, [sessionIdParam]);

  return (
    <>
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A12] text-white px-4 pt-24 pb-16 flex flex-col items-center">
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
            Choisis l&#39;abonnement Infini adapte a tes besoins
          </h1>
          <p className="mt-2 text-sm md:text-base text-neutral-400">
            Donne-toi enfin les moyens de reussir dans la musique !
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

      {checkoutStatus === "success" && (
        <div className="mt-6 w-full max-w-3xl rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100 shadow-[0_0_35px_rgba(16,185,129,0.25)]">
          <p className="font-semibold">Abonnement confirme via Stripe.</p>
          <p className="mt-1 text-xs text-emerald-200/80">
            Merci pour ta confiance ! Tu peux gerer ta facturation a tout moment.
          </p>
          {sessionIdParam && (
            <button
              type="button"
              onClick={handleManageBilling}
              disabled={isManagingBilling}
              className="mt-3 inline-flex items-center justify-center rounded-full border border-emerald-300/40 px-4 py-2 text-xs font-semibold text-emerald-50 transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-emerald-500/20"
            >
              {isManagingBilling ? "Ouverture..." : "Gerer la facturation"}
            </button>
          )}
        </div>
      )}

      {checkoutStatus === "canceled" && (
        <div className="mt-6 w-full max-w-3xl rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-100 shadow-[0_0_35px_rgba(251,191,36,0.25)]">
          Le paiement a ete annule. Tu peux retenter l&#39;experience quand tu es pret.
        </div>
      )}

      {feedbackMessage && (
        <div className="mt-6 w-full max-w-3xl rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
          {feedbackMessage}
        </div>
      )}

      <div className="mt-8 max-w-6xl w-full grid grid-cols-1 md:grid-cols-[repeat(3,250px)] gap-[24px] justify-center">
        {PLAN_DEFINITIONS.map((plan, idx) => {
          const monthlyPrice = parsePrice(plan.monthly);
          const yearlyPrice = parsePrice(plan.yearly);
          const totalMensuel = monthlyPrice * 12;
          const discount =
            totalMensuel > 0
              ? Math.round(((totalMensuel - yearlyPrice) / totalMensuel) * 100)
              : 0;

          let borderClass = "border-white/15";
          if (selectedPlan === plan.name) {
            borderClass = "border-white/40";
          } else if (plan.name === "INFINI X") {
            borderClass = "border-[#401a87]";
          }

          const lookupKey = plan.lookupKeys[billingCycle];
          const isProcessing = processingPlan === plan.name;
          const buttonDisabled = !lookupKey || isProcessing;
          const buttonLabel = !lookupKey
            ? "Plan indisponible"
            : isProcessing
              ? "Redirection..."
              : "S&#39;abonner";

          const cardClassName = [
            "relative flex flex-col items-center text-center cursor-pointer",
            borderClass,
            "border rounded-2xl p-6 bg-[#141416]/90 backdrop-blur-xl w-full h-[410px] hover:-translate-y-2 transition-transform duration-300 shadow-[0_10px_40px_rgba(0,0,0,.35)]",
          ].join(" ");

          const labelBaseClass = "absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase";
          const labelClassList = [labelBaseClass];
          if (plan.label === "BASIQUE") {
            labelClassList.push("bg-[#141416] text-zinc-200 border border-white/10");
          }
          if (plan.label === "POPULAIRE") {
            labelClassList.push("bg-[#141416] text-zinc-200 border border-white/10");
          }
          if (plan.label === "MEILLEURE OFFRE") {
            labelClassList.push("bg-[#401a87] text-white");
          }
          const labelClassName = labelClassList.join(" ");

          return (
            <motion.div
              key={idx}
              onClick={() => setSelectedPlan(plan.name)}
              className={cardClassName}
              whileTap={{ scale: 0.97 }}
            >
              {plan.label && <div className={labelClassName}>{plan.label}</div>}

              <h2 className="text-lg font-bold mb-1 mt-4">{plan.name}</h2>
              <p className="text-xs text-neutral-400">{plan.subTitle}</p>

              <div className="mb-3">
                <p className="text-2xl font-extrabold">
                  {billingCycle === "monthly" ? plan.monthly : plan.yearly}
                </p>
                <p className="text-xs text-neutral-400">
                  facture {billingCycle === "monthly" ? "mensuellement" : "annuellement"}
                </p>
                {billingCycle === "yearly" && discount > 0 && (
                  <div className="mt-1 flex flex-col items-center gap-2">
                    <p className="text-sm text-neutral-400 line-through opacity-75">
                      {(totalMensuel || 0).toFixed(2)} EUR
                    </p>
                    <div className="inline-block px-2 py-1 rounded-full bg-[#401a87] text-white text-[10px] font-semibold">
                      {discount}% de reduction
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
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleSubscribe(plan);
                }}
                disabled={buttonDisabled}
                className="mt-auto py-2.5 px-5 rounded-full border font-semibold text-sm transition-colors border-[#401a87] text-white hover:bg-[#401a87] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {buttonLabel}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-5 text-xs md:text-sm text-neutral-400">
        en savoir plus sur la tarification
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Abonnements;
