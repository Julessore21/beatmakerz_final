"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Item = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
};

const defaultItems: Item[] = [
  { id: 1, name: "Article A", price: 10, quantity: 2 },
  { id: 2, name: "Article B", price: 15, quantity: 1 },
  { id: 3, name: "Article C", price: 7.5, quantity: 3 },
];

const Panier: React.FC<{
  items?: Item[];
  totalPrice?: number;
}> = ({ items = defaultItems, totalPrice }) => {
  const router = useRouter();

  // Total calculé si non fourni
  const computedTotalPrice: number =
    typeof totalPrice === "number"
      ? totalPrice
      : items.reduce((acc, item) => {
          const priceVal = Number(item.price) || 0;
          const qtyVal = Number(item.quantity) || 0;
          return acc + priceVal * qtyVal;
        }, 0);

  // Nombre total d'articles
  const totalArticles = items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#1A1530] to-[#000000] text-white text-center p-8">
      {/* Titre */}
      <h1 className="text-6xl font-bold mt-[100px] mb-[22px]">MON PANIER</h1>

      {items.length > 0 ? (
        <>
          {/* Résumé */}
          <div className="mb-8 flex flex-col items-center space-y-2">
            <span className="text-xl font-medium">
              Nombre d&apos;articles : {totalArticles}
            </span>
            <span className="text-xl font-medium">
              Total : {computedTotalPrice.toFixed(2)} €
            </span>
          </div>

          {/* Liste d'articles */}
          <div className="w-full flex flex-col gap-2 px-[5px] mb-8">
            {items.map((item) => {
              const priceVal = Number(item.price) || 0;
              const qtyVal = Number(item.quantity) || 0;
              const itemTotal = (priceVal * qtyVal).toFixed(2);

              return (
                <div
                  key={item.id}
                  className="w-full border border-white bg-black/40 rounded-2xl p-4 flex justify-between items-center cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                  onClick={() => router.push(`/article/${item.id}`)}
                >
                  <div className="text-left">
                    <h2 className="font-bold text-lg">{item.name}</h2>
                  </div>
                  <div className="text-right space-y-1">
                    <p>Quantité : {qtyVal}</p>
                    <p className="font-semibold">{itemTotal} €</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Link
              href="/catalogue"
              className="px-6 py-3 bg-black border border-white text-white rounded-full font-bold uppercase hover:bg-[#1A1530] hover:border-[#1A1530] active:bg-[#1A1530] active:border-[#1A1530] transition-colors duration-300"
            >
              Retour au catalogue
            </Link>

            <button
              className="px-6 py-3 bg-black border border-white text-white rounded-full font-bold uppercase hover:bg-[#1A1530] hover:border-[#1A1530] active:bg-[#1A1530] active:border-[#1A1530] transition-colors duration-300"
              onClick={() => router.push("/checkout")}
            >
              PAYER
            </button>
          </div>
        </>
      ) : (
        <p className="text-xl">Votre panier est vide.</p>
      )}
    </div>
  );
};

export default Panier;
