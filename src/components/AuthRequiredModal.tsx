"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, LogIn, X } from "lucide-react";

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
            className="relative w-[min(480px,94vw)] rounded-2xl border border-white/10 bg-gradient-to-br from-[#101021] via-[#0b0b14] to-[#101428] p-6 shadow-[0_20px_90px_rgba(0,0,0,0.55)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Action protegee</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Connexion requise</h3>
                <p className="mt-2 text-sm text-zinc-300">{message || "Cette action necessite d'etre connecte."}</p>
              </div>
              <button
                aria-label="Fermer"
                onClick={onClose}
                className="rounded-full border border-white/10 p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                <LogIn className="h-4 w-4" />
                Se connecter
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Plus tard
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AuthRequiredModal;
