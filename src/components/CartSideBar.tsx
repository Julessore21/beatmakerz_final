"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CartSideBar = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const { items, totalPrice, removeItem, clearCart } = useCart();

  const goTo = (href: string) => {
    onClose();
    router.push(href);
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
          <motion.aside
            className="relative flex h-full w-[min(420px,92vw)] flex-col border-l border-white/10 bg-brand-card p-5 sm:p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Mon panier</h2>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer le panier">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-1 text-xs text-zinc-400">
              {items.length} beat{items.length > 1 ? "s" : ""} · {totalPrice.toFixed(2)} €
            </p>

            <div className="mt-5 flex-1 space-y-2 overflow-y-auto">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-zinc-400">{(Number(item.price) || 0).toFixed(2)} €</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label={`Retirer ${item.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="pt-10 text-center text-sm text-zinc-400">Ton panier est vide.</p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {items.length > 0 ? (
                <>
                  <Button fullWidth onClick={() => goTo("/web/panier")}>
                    Finaliser la commande
                  </Button>
                  <Button variant="ghost" fullWidth onClick={() => clearCart()}>
                    Vider le panier
                  </Button>
                </>
              ) : (
                <Button variant="secondary" fullWidth onClick={() => goTo("/web/catalogue")}>
                  Voir le catalogue
                </Button>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartSideBar;
