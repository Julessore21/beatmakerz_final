"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingCart, Receipt, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-[#0A0A12] via-[#0b0f1d] to-[#0f172a] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 text-emerald-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">Paiement validé</p>
            <h1 className="text-2xl font-semibold text-white">Merci pour ton achat</h1>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-6">
          <div className="flex items-start gap-3 text-sm text-zinc-200">
            <Receipt className="mt-0.5 h-5 w-5 text-emerald-300" />
            <div className="space-y-1">
              <p className="font-semibold text-white">Commande confirmée</p>
              <p className="text-zinc-300">Tes téléchargements et licences sont disponibles dans ton espace compte.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm text-zinc-200">
            <ArrowRight className="mt-0.5 h-5 w-5 text-emerald-300" />
            <div className="space-y-1">
              <p className="font-semibold text-white">Prochaines étapes</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                <li>Consulte tes commandes pour récupérer tes liens de téléchargement.</li>
                <li>Vérifie ton e-mail pour la confirmation et la facture.</li>
                <li>Besoin d’aide ? Contacte le support depuis ton compte.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push("/web/account")}
            className="w-full sm:w-auto rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Voir mes commandes
          </button>
          <button
            onClick={() => router.push("/web/marketplace")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <ShoppingCart className="h-4 w-4" /> Continuer mes achats
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Un problème avec ta commande ? Écris-nous via le support, on répond vite.
        </p>
      </div>
    </div>
  );
}
