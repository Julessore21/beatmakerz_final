"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CheckoutCancelPage() {
  const router = useRouter();
  return (
    <div className="min-h-[100vh] bg-[#0A0A12] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-xl backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
          <XCircle className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Paiement annulé</h1>
        <p className="mt-2 text-sm text-zinc-300">Le paiement a été annulé. Tu peux ajuster ton panier et réessayer.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push("/web/panier")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au panier
          </button>
          <button
            onClick={() => router.push("/web/checkout")}
            className="w-full sm:w-auto rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Reprendre le paiement
          </button>
        </div>
      </div>
    </div>
  );
}
