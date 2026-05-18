"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginInput } from "@/schemas/forms/loginSchema";
import { registerSchema, type RegisterInput } from "@/schemas/forms/registerSchema";

// Forcer le rendu dynamique pour éviter l'erreur useSearchParams
export const dynamic = 'force-dynamic';

const Profil: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, user: currentUser } = useAuth();

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

  const [loginData, setLoginData] = useState<LoginInput>({ email: "", password: "" });
  const [signupData, setSignupData] = useState<RegisterInput>({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginInput | "general", string>>>({});
  const [signupErrors, setSignupErrors] = useState<Partial<Record<keyof RegisterInput | "general", string>>>({});
  const [loginTouched, setLoginTouched] = useState<Partial<Record<keyof LoginInput, boolean>>>({});
  const [signupTouched, setSignupTouched] = useState<Partial<Record<keyof RegisterInput, boolean>>>({});

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updated = { ...loginData, [name]: value };
    setLoginData(updated);
    if (loginTouched[name as keyof LoginInput]) {
      const result = loginSchema.safeParse(updated);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === name);
        setLoginErrors((prev) => ({ ...prev, [name]: issue?.message ?? "" }));
      } else {
        setLoginErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleLoginBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setLoginTouched((prev) => ({ ...prev, [name]: true }));
    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === name);
      setLoginErrors((prev) => ({ ...prev, [name]: issue?.message ?? "" }));
    } else {
      setLoginErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSignupChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updated = { ...signupData, [name]: value };
    setSignupData(updated);
    if (signupTouched[name as keyof RegisterInput]) {
      const result = registerSchema.safeParse(updated);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === name);
        setSignupErrors((prev) => ({ ...prev, [name]: issue?.message ?? "" }));
      } else {
        setSignupErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSignupBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setSignupTouched((prev) => ({ ...prev, [name]: true }));
    const result = registerSchema.safeParse(signupData);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === name);
      setSignupErrors((prev) => ({ ...prev, [name]: issue?.message ?? "" }));
    } else {
      setSignupErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const errs: Partial<Record<keyof LoginInput, string>> = {};
      result.error.issues.forEach((i) => {
        const key = i.path[0] as keyof LoginInput;
        if (key && !errs[key]) errs[key] = i.message;
      });
      setLoginErrors(errs);
      setLoginTouched({ email: true, password: true });
      return;
    }

    try {
      await login(result.data);
      router.replace("/web/account");
      router.refresh();
    } catch (error: unknown) {
      setLoginErrors({ general: error instanceof Error ? error.message : "Identifiants invalides" });
    }
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = registerSchema.safeParse(signupData);
    if (!result.success) {
      const errs: Partial<Record<keyof RegisterInput, string>> = {};
      result.error.issues.forEach((i) => {
        const key = i.path[0] as keyof RegisterInput;
        if (key && !errs[key]) errs[key] = i.message;
      });
      setSignupErrors(errs);
      setSignupTouched({ email: true, password: true });
      return;
    }

    try {
      await register({
        email: result.data.email,
        password: result.data.password,
        displayName: result.data.email.split('@')[0],
      });
      router.replace("/web/account");
      router.refresh();
    } catch (error: unknown) {
      setSignupErrors({ general: error instanceof Error ? error.message : "Cet email est deja utilise ou invalide" });
    }
  };

  return (
    <div className="page-section">
      <div className="card w-full max-w-3xl flex flex-col md:flex-row overflow-hidden bg-[#0b0d19] border border-white/10 shadow-2xl">
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mx-auto mb-10 flex w-[260px] items-center justify-center gap-1 rounded-full border border-white/10 bg-[#0f0f18] p-1 shadow-[0_6px_24px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isLogin ? "bg-[var(--brand-purple)] text-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]" : "text-white/75 hover:text-white"
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                !isLogin ? "bg-[var(--brand-purple)] text-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]" : "text-white/75 hover:text-white"
              }`}
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
                <form className="space-y-4" onSubmit={handleLoginSubmit} noValidate>
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
                      onBlur={handleLoginBlur}
                      className="input-field"
                      placeholder="Entrez votre email"
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
                      onBlur={handleLoginBlur}
                      className="input-field"
                      placeholder="Entrez votre mot de passe"
                    />
                    {loginErrors.password && <p className="text-xs text-red-500 mt-1">{loginErrors.password}</p>}
                  </div>
                  {loginErrors.general && <p className="text-xs text-red-500">{loginErrors.general}</p>}
                  <button
                    type="submit"
                    className="w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition shadow-[0_12px_32px_rgba(79,43,212,0.35)] bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-strong)]"
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
                  S&apos;inscrire
                </h2>
                <form className="space-y-4" onSubmit={handleSignupSubmit} noValidate>
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
                      onBlur={handleSignupBlur}
                      className="input-field"
                      placeholder="Entrez votre email"
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
                      onBlur={handleSignupBlur}
                      className="input-field"
                      placeholder="Entrez un mot de passe securise"
                    />
                    {signupErrors.password && <p className="text-xs text-red-500 mt-1">{signupErrors.password}</p>}
                  </div>
                  {signupErrors.general && <p className="text-xs text-red-500">{signupErrors.general}</p>}
                  <button
                    type="submit"
                    className="w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition shadow-[0_12px_32px_rgba(79,43,212,0.35)] bg-[var(--brand-purple)] hover:bg-[var(--brand-purple-strong)]"
                  >
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
