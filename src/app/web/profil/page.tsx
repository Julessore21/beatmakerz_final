"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PageShell } from "@/components/ui/page";
import { cn } from "@/lib/cn";
import { loginSchema } from "@/schemas/forms/loginSchema";
import { registerSchema } from "@/schemas/forms/registerSchema";

const MIN_PASSWORD = 8;

type Mode = "login" | "signup";
type Errors = { email?: string; password?: string; general?: string };

/**
 * N'accepte que des chemins internes pour éviter les redirections ouvertes.
 * Rejette aussi "\" (que les navigateurs lisent comme "/", ex. "/\evil.com")
 * et les caractères de contrôle, puis vérifie que l'URL résolue reste sur notre origine.
 */
const DEFAULT_NEXT = "/web/account";
const safeNext = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x1f]/.test(value)) return DEFAULT_NEXT;
  try {
    const base = "https://beatmakerz.invalid";
    const url = new URL(value, base);
    return url.origin === base ? url.pathname + url.search + url.hash : DEFAULT_NEXT;
  } catch {
    return DEFAULT_NEXT;
  }
};

export default function ProfilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, user } = useAuth();
  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const next = safeNext(searchParams.get("next"));

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, router, next]);

  const switchMode = (value: Mode) => {
    setMode(value);
    setErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = (mode === "login" ? loginSchema : registerSchema).safeParse({ email: email.trim(), password });
    if (!result.success) {
      const nextErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as "email" | "password";
        nextErrors[field] ??= issue.message;
      }
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    setPending(true);
    try {
      if (mode === "login") {
        await login({ email: email.trim(), password });
      } else {
        // L'API exige un nom d'au moins 2 caractères : partie avant @, sinon un nom par défaut.
        const localPart = email.trim().split("@")[0] ?? "";
        await register({ email: email.trim(), password, displayName: localPart.length >= 2 ? localPart : "Artiste" });
      }
      router.replace(next);
    } catch (error) {
      const fallback = mode === "login" ? "Identifiants invalides" : "Cet email est déjà utilisé ou invalide";
      setErrors({ general: error instanceof Error && error.message ? error.message : fallback });
    } finally {
      setPending(false);
    }
  };

  return (
    <PageShell size="md" className="flex min-h-[85vh] items-center">
      <Card className="flex w-full flex-col overflow-hidden p-0 md:flex-row">
        <div className="flex flex-col justify-center p-8 md:w-1/2">
          <div className="mx-auto mb-8 flex w-full max-w-[280px] gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {(["login", "signup"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => switchMode(value)}
                aria-pressed={mode === value}
                className={cn(
                  "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  mode === value ? "bg-brand text-white" : "text-white/70 hover:text-white"
                )}
              >
                {value === "login" ? "Se connecter" : "S’inscrire"}
              </button>
            ))}
          </div>

          <h1 className="mb-6 text-center text-2xl font-bold">{mode === "login" ? "Bon retour !" : "Crée ton compte"}</h1>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.fr"
              />
              {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "login" ? "Ton mot de passe" : `${MIN_PASSWORD} caractères minimum`}
              />
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
            </div>
            {errors.general && <p className="text-sm text-rose-400">{errors.general}</p>}
            <Button type="submit" size="lg" fullWidth disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Connexion" : "Créer mon compte"}
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-center bg-black/30 p-6 md:w-1/2">
          <img src="/img/beatmakerzlogin.png" alt="Beatmakerz" className="max-h-60 object-contain" />
        </div>
      </Card>
    </PageShell>
  );
}
