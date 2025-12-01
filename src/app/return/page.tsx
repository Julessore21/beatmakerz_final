"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SessionStatusResponse {
  id: string;
  status: string;
  paymentStatus: string;
  customerEmail: string | null;
  amountTotal?: number | null;
  currency?: string | null;
  error?: string;
}

type ViewState =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "complete"; email: string | null }
  | { state: "unknown"; rawStatus: string };

export default function ReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [viewState, setViewState] = useState<ViewState>({ state: "loading" });

  useEffect(() => {
    if (!sessionId) {
      setViewState({ state: "error", message: "Identifiant de session Stripe manquant." });
      return;
    }

    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/stripe/session-status?session_id=${sessionId}`);
        const payload = (await response.json()) as SessionStatusResponse;

        if (!response.ok) {
          throw new Error(payload.error || "Erreur lors de la recuperation du statut de paiement.");
        }

        if (cancelled) return;

        if (payload.status === "open") {
          router.replace(`/checkout?session_id=${sessionId}`);
          return;
        }

        if (payload.status === "complete") {
          setViewState({ state: "complete", email: payload.customerEmail ?? null });
          return;
        }

        setViewState({ state: "unknown", rawStatus: payload.status });
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Erreur inattendue.";
        setViewState({ state: "error", message });
      }
    };

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [router, sessionId]);

  const content = useMemo(() => {
    switch (viewState.state) {
      case "loading":
        return <p className="text-sm text-neutral-300">Verification du paiement en cours...</p>;
      case "error":
        return (
          <div className="space-y-4">
            <p className="text-sm text-rose-200">{viewState.message}</p>
            <button
              type="button"
              onClick={() => router.push("/web/abonnements")}
              className="btn-primary"
            >
              Retour aux abonnements
            </button>
          </div>
        );
      case "complete":
        return (
          <div className="space-y-4 text-sm text-emerald-100">
            <p>
              Merci pour ta confiance ! Un e-mail de confirmation sera envoye
              {viewState.email ? ` a ${viewState.email}` : " a l'adresse associee a ton compte Stripe"}.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => router.push("/web/abonnements")}
                className="btn-primary"
              >
                Revenir aux abonnements
              </button>
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="inline-flex items-center rounded-full border border-emerald-300/40 px-4 py-2 text-xs font-semibold text-emerald-50 transition hover:bg-emerald-500/20"
              >
                Ouvrir un nouveau checkout
              </button>
            </div>
          </div>
        );
      case "unknown":
        return (
          <div className="space-y-4 text-sm text-amber-200">
            <p>Le paiement est dans un etat inattendu : {viewState.rawStatus}.</p>
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="btn-primary"
            >
              Reessayer le paiement
            </button>
          </div>
        );
      default:
        return null;
    }
  }, [router, viewState]);

  return (
    <div className="page-section">
      <div className="card max-w-xl mx-auto border border-white/10 bg-black/40 p-6">
        <h1 className="text-xl font-semibold text-white mb-4">Statut du paiement</h1>
        {content}
      </div>
    </div>
  );
}

