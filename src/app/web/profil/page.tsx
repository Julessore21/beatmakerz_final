"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Profil: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, user: currentUser } = useAuth();

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setIsLogin(false);
    } else if (mode === "login") {
      setIsLogin(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    router.replace("/web/account");
    router.refresh();
  }, [currentUser, router]);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [signupErrors, setSignupErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const MIN_PASSWORD = 8;

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: { email?: string; password?: string; general?: string } = {};
    if (!loginData.email.trim()) errors.email = "Email requis";
    if (!loginData.password.trim()) errors.password = "Mot de passe requis";
    if (loginData.password.length > 0 && loginData.password.length < MIN_PASSWORD) {
      errors.password = `Mot de passe trop court (min ${MIN_PASSWORD} caracteres)`;
    }
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const success = await login(loginData.email, loginData.password);
    if (success) {
      router.replace("/web/account");
      router.refresh();
    } else {
      setLoginErrors({ general: "Identifiants invalides" });
    }
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: { email?: string; password?: string; general?: string } = {};
    if (!signupData.email.trim()) errors.email = "Email requis";
    if (!signupData.password.trim()) errors.password = "Mot de passe requis";
    if (signupData.password.length > 0 && signupData.password.length < MIN_PASSWORD) {
      errors.password = `Mot de passe trop court (min ${MIN_PASSWORD} caracteres)`;
    }
    setSignupErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const success = await signup(signupData.email, signupData.password);
    if (success) {
      router.replace("/web/account");
      router.refresh();
    } else {
      setSignupErrors({ general: "Cet email est deja utilise ou invalide" });
    }
  };

  return (
    <div className="page-section">
      <div className="card w-full max-w-3xl flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mx-auto relative flex items-center justify-center w-[220px] h-12 border border-white rounded-full bg-transparent mb-10">
            <motion.div
              className="absolute top-1 bottom-1 w-1/2 rounded-full bg-[#401a87]"
              animate={{ left: isLogin ? "5px" : "104px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="relative z-10 w-1/2 text-sm font-semibold text-center transition-colors text-white rounded-full"
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="relative z-10 w-1/2 text-sm font-semibold text-center transition-colors text-white rounded-full"
            >
              S&apos;inscrire
            </button>
          </div>

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
                    <label className="block text-sm text-gray-400 mb-1" htmlFor="login-email">
                      Email
                    </label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="input-field"
                      placeholder="Entrez votre email"
                      required
                    />
                    {loginErrors.email && <p className="text-xs text-red-500 mt-1">{loginErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1" htmlFor="login-password">
                      Mot de passe
                    </label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="input-field"
                      placeholder="Entrez votre mot de passe"
                      required
                    />
                    {loginErrors.password && <p className="text-xs text-red-500 mt-1">{loginErrors.password}</p>}
                  </div>
                  {loginErrors.general && <p className="text-xs text-red-500">{loginErrors.general}</p>}
                  <button type="submit" className="btn-primary w-full">
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
                  S&apos;inscrire
                </h2>
                <form className="space-y-4" onSubmit={handleSignupSubmit}>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1" htmlFor="signup-email">
                      Email
                    </label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      className="input-field"
                      placeholder="Entrez votre email"
                      required
                    />
                    {signupErrors.email && <p className="text-xs text-red-500 mt-1">{signupErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1" htmlFor="signup-password">
                      Mot de passe
                    </label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className="input-field"
                      placeholder="Entrez un mot de passe securise"
                      required
                    />
                    {signupErrors.password && <p className="text-xs text-red-500 mt-1">{signupErrors.password}</p>}
                  </div>
                  {signupErrors.general && <p className="text-xs text-red-500">{signupErrors.general}</p>}
                  <button type="submit" className="btn-primary w-full">
                    Creer un compte
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="md:w-1/2 flex items-center justify-center p-4 bg-black/30">
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





