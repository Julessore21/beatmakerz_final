"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingCart } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  return (
    <div className="min-h-[100vh] bg-[#0A0A12] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-xl backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Paiement confirmé</h1>
        <p className="mt-2 text-sm text-zinc-300">Ta commande est validée. Tes liens de téléchargement seront disponibles dans tes commandes.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push("/web/account")}
            className="w-full sm:w-auto rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            Voir mes commandes
          </button>
          <button
            onClick={() => router.push("/web/marketplace")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <ShoppingCart className="h-4 w-4" /> Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
}
