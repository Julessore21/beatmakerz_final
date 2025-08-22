"use client";

import React from "react";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black via-[#1A1530] to-[#000000] text-white p-4">
      <h1 className="text-2xl mb-4">Bonjour {user}</h1>
      <button
        onClick={handleLogout}
        className="bg-[#401a87] hover:bg-[#5e2ea4] transition-colors text-white font-semibold py-2 px-4 rounded-full"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default AccountPage;

