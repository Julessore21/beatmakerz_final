"use client";

import React, { useState } from "react";
import type { JSX } from "react";

const referralLink = "https://beatmakerz.fr/ref?user=12345";

const guests = [
  { id: 1, name: "Guest 1", pointsEarned: 10 },
  { id: 2, name: "Guest 2", pointsEarned: 25 },
  { id: 3, name: "Guest 3", pointsEarned: 5 },
];

export default function ProgrammeFidelite(): JSX.Element {
  const [basePoints] = useState<number>(123);
  const [showPointsModal, setShowPointsModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const totalGuestPoints = guests.reduce(
    (acc, guest) => acc + guest.pointsEarned,
    0
  );
  const additionalPoints = totalGuestPoints * 0.5;
  const totalPoints = basePoints + additionalPoints;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white flex flex-col">
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-10">
        <div className="mt-20 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]">
          <h1 className="text-4xl font-bold tracking-tight">Programme de fidélité</h1>
          <p className="mt-1 text-sm text-zinc-400">Gagne des points en invitant tes amis et en achetant sur la plateforme</p>
        </div>

        {/* Lien de parrainage */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-gray-400 uppercase mb-1">
                Lien de parrainage
              </p>
              <p className="text-white font-semibold break-all">
                {referralLink}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                <img
                  src="/img/link-svgrepo-com.svg"
                  alt="icon"
                  className="w-5 h-5"
                />
                Copier
              </button>
              {copied && (
                <div className="absolute top-full right-0 mt-1 rounded border border-white/10 bg-white/10 px-3 py-1 text-xs text-white shadow">
                  Copié !
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Mes points</h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold">{totalPoints}</span>
            <button onClick={() => setShowPointsModal(true)} className="p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Etapes */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "INSCRIS-TOI",
              text: "Inscris-toi comme membre pour profiter du programme de fidélité",
            },
            {
              step: "02",
              title: "AFFILIATION",
              text: "Chaque utilisateur que tu invites qui effectue un achat sur le site te rapporte 50% des points dont il bénéficie",
            },
            {
              step: "03",
              title: "GAGNE DES POINTS",
              text: "Achète un article = 3 Points\nInvite un ami = 10 points\nPrends un abonnement = 20 points",
            },
            {
              step: "04",
              title: "UTILISE TES RÉCOMPENSES",
              text: "200 Points = 20%\n300 Points = 30%\n500 Points = 50%\n1000 Points = 100%",
            },
          ].map(({ step, title, text }) => (
            <div
              key={step}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur"
            >
              <h3 className="text-3xl font-extrabold mb-2">{step}</h3>
              <h4 className="text-lg font-bold mb-2">{title}</h4>
              <p className="text-xs text-zinc-300 whitespace-pre-line">
                {text}
              </p>
            </div>
          ))}
        </section>

        {/* Panel invités */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-0 backdrop-blur overflow-hidden">
          <div className="px-6 pt-6">
          <h2 className="text-lg font-semibold mb-4">Panel de Gestion d&apos;Invités</h2>
          </div>
          <div className="max-h-[360px] overflow-y-auto px-6 pb-6">
          <table className="w-full text-left text-sm text-zinc-200">
            <thead className="uppercase text-zinc-400 border-b border-white/10">
              <tr>
                <th className="py-2">ID</th>
                <th className="py-2">Nom</th>
                <th className="py-2">Points Gagnés</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr
                  key={guest.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-2 px-2">{guest.id}</td>
                  <td className="py-2 px-2">{guest.name}</td>
                  <td className="py-2 px-2">{guest.pointsEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
      </main>

      {/* Modal points */}
      {showPointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="w-[min(520px,92vw)] rounded-2xl border border-white/10 bg-[#0f0f14]/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,.6)]">
            <h2 className="text-2xl font-bold mb-4 text-center">Détails des points</h2>
            <p className="mb-2 font-medium">Mes points accumulés : {basePoints}</p>
            <p className="mb-2 font-medium">Points gagnés via vos invités (50%) : {additionalPoints}</p>
            <p className="mb-6 font-medium">Total : {totalPoints}</p>
            <div className="text-center">
              <button
                onClick={() => setShowPointsModal(false)}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-black text-gray-400 text-center py-4">
        © 2025 Beatmakerz. Tous droits réservés.
      </footer>
    </div>
  );
}
