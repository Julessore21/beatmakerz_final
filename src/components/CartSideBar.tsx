"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Trash2, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CartSideBar = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const { items, totalPrice, totalItems, addItem, removeItem, clearCart, decrementItem } = useCart();

  const handleCheckout = () => {
    onClose();
    router.push("/web/panier");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="flex-1" />
          <motion.div
            className="relative h-full w-[min(420px,92vw)] border-l border-white/10 bg-gradient-to-b from-[#0b0b12] to-black p-5 sm:p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Mon panier</h2>
              <button
                onClick={onClose}
                aria-label="Fermer le panier"
                className="rounded-full border border-white/10 p-1.5 text-white transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 text-xs text-zinc-400">
              Articles : {totalItems} • Total : {totalPrice.toFixed(2)} EUR
            </div>

            <div className="mt-4 space-y-3">
              {items.length > 0 ? (
                items.map((item) => {
                  const priceValue = Number(item.price) || 0;
                  const quantityValue = Number(item.quantity) || 0;
                  const itemTotal = (priceValue * quantityValue).toFixed(2);
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {priceValue.toFixed(2)} EUR / unite
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            <button
                              onClick={() => decrementItem(item.id)}
                              className="rounded-md p-1 text-white transition-colors hover:bg-white/10"
                              aria-label="Diminuer"
                            >
                              -
                            </button>
                            <div className="min-w-6 text-center text-sm tabular-nums text-white">
                              {quantityValue}
                            </div>
                            <button
                              onClick={() => addItem({ id: item.id, name: item.name, price: priceValue })}
                              className="rounded-md p-1 text-white transition-colors hover:bg-white/10"
                              aria-label="Augmenter"
                            >
                              +
                            </button>
                          </div>
                          <div className="w-16 text-right text-sm font-semibold text-white">
                            {itemTotal} EUR
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-2 rounded-md border border-white/10 p-2 text-zinc-200 transition-colors hover:bg-white/10"
                            aria-label="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-sm text-zinc-400">
                  Votre panier est vide.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={handleCheckout}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10" aria-label="Voir mon panier"
              >
                Voir le panier
              </button>
              <button
                onClick={() => {
                  clearCart();
                  onClose();
                }}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Vider le panier
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartSideBar;
