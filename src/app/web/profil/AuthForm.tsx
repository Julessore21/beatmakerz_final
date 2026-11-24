"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/Logo";

/** Les messages de l'API, en français. */
function explain(message: string, mode: "login" | "register"): string {
  if (/already in use/i.test(message)) return "Un compte existe déjà avec cette adresse. Connecte-toi.";
  if (/invalid credentials|unauthorized/i.test(message)) return "Adresse ou mot de passe incorrect.";
  if (/password/i.test(message) && /8|longer|short/i.test(message)) return "Le mot de passe doit faire au moins 8 caractères.";
  if (/displayName/i.test(message)) return "Ton nom d’artiste doit faire au moins 2 caractères.";
  if (/email/i.test(message)) return "Cette adresse mail n’est pas valide.";
  if (/fetch|network|failed/i.test(message)) return "Le serveur ne répond pas. Réessaie dans un instant.";
  return mode === "login" ? "Connexion impossible pour le moment." : "Inscription impossible pour le moment.";
}

/** Seules les adresses du site sont des destinations après connexion. */
const safeNext = (next: string | null) => (next && next.startsWith("/") && !next.startsWith("//") ? next : "/web/account");

export function AuthForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const forPayment = params.get("raison") === "paiement";
  const [mode, setMode] = useState<"login" | "register">(forPayment ? "register" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = safeNext(params.get("next"));

  useEffect(() => {
    if (!isLoading && isAuthenticated && !busy) router.replace(next);
  }, [isAuthenticated, isLoading, busy, next, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Cette adresse mail n’est pas valide.");
    if (password.length < 8) return setError("Le mot de passe doit faire au moins 8 caractères.");
    if (mode === "register" && name.trim().length < 2) return setError("Ton nom d’artiste doit faire au moins 2 caractères.");
    setBusy(true);
    try {
      if (mode === "login") await login({ email: email.trim(), password });
      else await register({ email: email.trim(), password, displayName: name.trim() });
      router.replace(next);
    } catch (err) {
      setError(explain(err instanceof Error ? err.message : "", mode));
      setBusy(false);
    }
  };

  return (
    <div className="container-site flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-10 w-10" />
          <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.02em]">{mode === "login" ? "Content de te revoir" : "Crée ton compte"}</h1>
          <p className="mt-2 text-[15px] text-fg-muted">
            {forPayment ? "Ton panier est gardé. Il ne reste que cette étape avant le paiement." : mode === "login" ? "Retrouve tes achats et tes téléchargements." : "Tes prods achetées t’y attendront, à télécharger quand tu veux."}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 rounded-full border border-line bg-ink-850 p-1" role="tablist">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => (setMode(m), setError(null))}
              className={cn("h-9 rounded-full text-[14px] font-medium transition-colors", mode === m ? "bg-fg text-ink" : "text-fg-muted hover:text-fg")}
            >
              {m === "login" ? "Se connecter" : "Créer un compte"}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-4" noValidate>
          {mode === "register" && (
            <Field label="Nom d’artiste">
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="nickname" placeholder="Ton blaze" />
            </Field>
          )}
          <Field label="Adresse mail">
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="toi@exemple.fr" />
          </Field>
          <Field label="Mot de passe">
            <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder={mode === "register" ? "8 caractères minimum" : undefined} />
          </Field>
          {error && <p className="rounded-lg bg-white/[0.05] px-3 py-2.5 text-[14px] text-fg">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Se connecter" : forPayment ? "Créer mon compte et continuer" : "Créer mon compte"}
          </Button>
        </form>

        {mode === "login" && (
          <p className="mt-6 text-center text-[13px] text-fg-faint">
            Mot de passe oublié ?{" "}
            <Link href="/web/contact" className="text-fg-muted underline underline-offset-4 hover:text-fg">
              Écris-nous
            </Link>
          </p>
        )}
        {mode === "register" && (
          <p className="mt-6 text-center text-[12px] leading-relaxed text-fg-faint">
            En créant ton compte, tu acceptes les{" "}
            <Link href="/web/cgu" className="underline underline-offset-2 hover:text-fg">
              conditions d’utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/web/politique" className="underline underline-offset-2 hover:text-fg">
              politique de confidentialité
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-fg-muted">{label}</span>
      {children}
    </label>
  );
}
