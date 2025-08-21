"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Profil: React.FC = () => {
  // Mode "Se connecter" / "S'inscrire"
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const router = useRouter();
  const { login, signup } = useAuth();

  // États des formulaires
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", password: "" });

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = login(loginData.username, loginData.password);
    if (success) {
      router.push("/");
    } else {
      alert("Identifiants invalides");
    }
  };

  const handleSignupSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = signup(signupData.username, signupData.password);
    if (success) {
      router.push("/");
    } else {
      alert("Nom d'utilisateur déjà existant");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-[#1A1530] to-[#000000] p-4">
      {/* Conteneur principal */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row bg-[#191926] border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
        {/* Bloc gauche : Toggle + Formulaire */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          {/* Toggle */}
          <div className="mx-auto relative flex items-center justify-center w-[220px] h-12 border border-white rounded-full bg-transparent mb-10">
            <motion.div
              className="absolute top-1 bottom-1 w-1/2 rounded-full bg-[#401a87]"
              animate={{ left: isLogin ? "5px" : "104px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            <button
              onClick={() => setIsLogin(true)}
              className="relative z-10 w-1/2 text-sm font-semibold text-center transition-colors text-white rounded-full"
            >
              Se connecter
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className="relative z-10 w-1/2 text-sm font-semibold text-center transition-colors text-white rounded-full"
            >
              S'inscrire
            </button>
          </div>

          {/* Formulaires avec transition */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  SE CONNECTER
                </h2>
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <div>
                    <label
                      className="block text-sm text-gray-400 mb-1"
                      htmlFor="login-username"
                    >
                      Nom d’utilisateur
                    </label>
                    <input
                      id="login-username"
                      name="username"
                      type="text"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      className="w-full bg-black text-white p-2 rounded-full border border-gray-600 focus:outline-none focus:border-gray-400 text-sm"
                      placeholder="Entrez votre nom d’utilisateur"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm text-gray-400 mb-1"
                      htmlFor="login-password"
                    >
                      Mot de passe
                    </label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="w-full bg-black text-white p-2 rounded-full border border-gray-600 focus:outline-none focus:border-gray-400"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#401a87] hover:bg-[#5e2ea4] transition-colors text-white font-semibold py-2 rounded-full"
                  >
                    Connexion
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  S'INSCRIRE
                </h2>
                <form className="space-y-4" onSubmit={handleSignupSubmit}>
                  <div>
                    <label
                      className="block text-sm text-gray-400 mb-1"
                      htmlFor="signup-username"
                    >
                      Nom d’utilisateur
                    </label>
                    <input
                      id="signup-username"
                      name="username"
                      type="text"
                      value={signupData.username}
                      onChange={handleSignupChange}
                      className="w-full bg-black text-white p-2 rounded-full border border-gray-600 focus:outline-none focus:border-gray-400 text-sm"
                      placeholder="Choisissez un nom d’utilisateur"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm text-gray-400 mb-1"
                      htmlFor="signup-password"
                    >
                      Mot de passe
                    </label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className="w-full bg-black text-white p-2 rounded-full border border-gray-600 focus:outline-none focus:border-gray-400"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#401a87] hover:bg-[#5e2ea4] transition-colors text-white font-semibold py-2 rounded-full"
                  >
                    Créer un compte
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bloc droit : Image du logo */}
        <div className="md:w-1/2 bg-[#191926] flex items-center justify-center p-4">
          <img
            src="/img/beatmakerzlogin.png"
            alt="beatmakerz logo"
            className="object-contain max-h-60"
          />
        </div>
      </div>
    </div>
  );
};

export default Profil;
