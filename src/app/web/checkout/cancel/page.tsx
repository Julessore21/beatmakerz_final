"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, RotateCcw, Info } from "lucide-react";

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-[#0A0A12] via-[#0b0f1d] to-[#0f172a] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 text-amber-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Paiement annulé</p>
            <h1 className="text-2xl font-semibold text-white">Le paiement n’a pas abouti</h1>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-6">
          <div className="flex items-start gap-3 text-sm text-zinc-200">
            <Info className="mt-0.5 h-5 w-5 text-amber-300" />
            <div className="space-y-1">
              <p className="font-semibold text-white">Ce que tu peux faire</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                <li>Vérifie ton moyen de paiement ou ton solde.</li>
                <li>Reviens au panier pour ajuster tes licences ou quantités.</li>
                <li>Réessaie le paiement ou contacte le support si besoin.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push("/web/panier")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au panier
          </button>
          <button
            onClick={() => router.push("/web/checkout")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <RotateCcw className="h-4 w-4" /> Reprendre le paiement
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Besoin d’aide ? Contacte le support depuis ton compte ou via le formulaire de contact.
        </p>
      </div>
    </div>
  );
}
