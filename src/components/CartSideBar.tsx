"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CartSideBar = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const { items, totalPrice, totalItems } = useCart();

  const computedTotalPrice = totalPrice;
  const totalArticles = totalItems;

  const handleCloseAndNavigate = () => {
    onClose();
    router.push("/panier");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex bg-black/20 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="flex-1" />
          <motion.div
            className="w-1/5 h-full bg-black p-6 relative"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-7 right-4 text-white hover:rotate-180 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-4">MON PANIER</h2>

            <div className="space-y-2">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm border-b border-gray-500 pb-2"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-lg">Votre panier est vide.</p>
              )}
            </div>

            <div className="mt-4 flex justify-between text-lg font-bold">
              <span>Articles : {totalArticles}</span>
              <span>Total : {computedTotalPrice.toFixed(2)} €</span>
            </div>

            <div className="mt-6 flex flex-col space-y-3">
              <button
                onClick={handleCloseAndNavigate}
                className="block text-center py-2 px-4 bg-black border border-white text-white font-bold uppercase rounded-full hover:bg-[#401a87] hover:border-[#401a87] transition-colors duration-300"
              >
                Voir mon panier
              </button>
              <button className="block py-2 px-4 bg-black border border-white text-white font-bold uppercase rounded-full hover:bg-[#401a87] hover:border-[#401a87] transition-colors duration-300">
                Payer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartSideBar;
