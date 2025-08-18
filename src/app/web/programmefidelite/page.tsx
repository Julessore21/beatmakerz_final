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
    <div className="min-h-screen bg-gradient-to-b from-[#1A1530] to-black text-white flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold tracking-wide mt-20 mb-8 text-center">
          PROGRAMME DE FIDÉLITÉ
        </h1>

        {/* Lien de parrainage */}
        <div className="bg-[#2A2246]/60 rounded-xl p-4 mb-6 shadow-md">
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
                className="flex items-center gap-2 px-4 py-2 bg-[#4b3a6d]/60 hover:bg-[#5e2ea4] transition-colors rounded-full"
              >
                <img
                  src="/img/link-svgrepo-com.svg"
                  alt="icon"
                  className="w-5 h-5"
                />
                Copier
              </button>
              {copied && (
                <div className="absolute top-full right-0 mt-1 bg-[#5e2ea4] text-white text-xs px-3 py-1 rounded shadow animate-fade-in-out">
                  Copié !
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="bg-[#2A2246]/30 rounded-xl p-4 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">MES POINTS :</h2>
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
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              className="bg-[#2A2246]/30 rounded-xl p-6 shadow hover:shadow-xl text-center"
            >
              <h3 className="text-3xl font-extrabold mb-2">{step}</h3>
              <h4 className="text-lg font-bold mb-2">{title}</h4>
              <p className="text-xs text-gray-300 whitespace-pre-line">
                {text}
              </p>
            </div>
          ))}
        </section>

        {/* Panel invités */}
        <section className="bg-[#2A2246]/30 rounded-xl p-6 shadow max-h-[225px] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Panel de Gestion d'Invités</h2>
          <table className="w-full text-left text-sm text-gray-200">
            <thead className="uppercase text-gray-400 border-b border-gray-600">
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
                  className="border-b border-gray-600 hover:bg-[#332B57] transition-colors"
                >
                  <td className="py-2 px-2">{guest.id}</td>
                  <td className="py-2 px-2">{guest.name}</td>
                  <td className="py-2 px-2">{guest.pointsEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Modal points */}
      {showPointsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-[#1A1530]/95 border border-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Détails des points
            </h2>
            <p className="mb-2 font-medium">
              Mes points accumulés : {basePoints}
            </p>
            <p className="mb-2 font-medium">
              Points gagnés via vos invités (50%) : {additionalPoints}
            </p>
            <p className="mb-6 font-medium">Total : {totalPoints}</p>
            <div className="text-center">
              <button
                onClick={() => setShowPointsModal(false)}
                className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
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
