"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/profil");
    }
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <motion.div
      className="page-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="card w-full max-w-md p-8 text-center space-y-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold">Bonjour {user}</h1>
        <p className="text-sm text-gray-300">
          Gère ton compte et découvre tes options.
        </p>
        <div className="grid gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/profil")}
            className="btn-primary w-full"
          >
            Paramètres du profil
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/panier")}
            className="btn-primary w-full"
          >
            Mon panier
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="btn-primary w-full"
        >
          Se déconnecter
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AccountPage;

