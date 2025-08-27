"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

const Panier: React.FC = () => {
  const router = useRouter();
  const { items, totalItems, totalPrice, addItem, removeItem, decrementItem } = useCart();

  const computedTotalPrice: number = totalPrice;
  const totalArticles = totalItems;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-28 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-center text-4xl font-bold tracking-tight">Mon panier</h1>
        <div className="mt-2 text-center text-sm text-zinc-400">{totalArticles} article{totalArticles>1?"s":""} • Total {computedTotalPrice.toFixed(2)} €</div>

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
          <div className="mt-6 w-full flex flex-col gap-3">
            {items.map((item) => {
              const priceVal = Number(item.price) || 0;
              const qtyVal = Number(item.quantity) || 0;
              const itemTotal = (priceVal * qtyVal).toFixed(2);

              return (
                <div
                  key={item.id}
                  className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{item.name}</div>
                      <div className="text-xs text-zinc-400">Prix unité {priceVal.toFixed(2)} €</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                        <button
                          onClick={() => decrementItem(item.id)}
                          className="rounded-md p-1 hover:bg-white/10"
                          aria-label="Diminuer"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="min-w-6 text-center text-sm tabular-nums">{qtyVal}</div>
                        <button
                          onClick={() => addItem({ id: item.id, name: item.name, price: priceVal })}
                          className="rounded-md p-1 hover:bg-white/10"
                          aria-label="Augmenter"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="w-20 text-right text-sm font-semibold">{itemTotal} €</div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 rounded-md border border-white/10 p-2 text-zinc-200 hover:bg-white/10"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/web/catalogue"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              Retour au catalogue
            </Link>

            <button
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90"
              onClick={() => router.push("/checkout")}
            >
              Payer
            </button>
          </div>
        </>
      ) : (
        <div className="mt-10 text-center text-zinc-400">Votre panier est vide.</div>
      )}
      </div>
    </div>
  );
};

export default Panier;
