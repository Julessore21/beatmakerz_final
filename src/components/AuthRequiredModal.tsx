"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AuthRequiredModalProps = {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  message?: string;
};

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({ open, onClose, onLogin, message }) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative w-[min(480px,94vw)] rounded-2xl border border-white/10 bg-brand-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm uppercase tracking-[0.2em] text-brand-lavender">Action protégée</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Connexion requise</h3>
                <p className="mt-2 text-sm text-zinc-300">{message || "Cette action nécessite d'être connecté."}</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Fermer" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={onLogin}>
                <LogIn className="h-4 w-4" />
                Se connecter
              </Button>
              <Button variant="outline" onClick={onClose}>
                Plus tard
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AuthRequiredModal;
