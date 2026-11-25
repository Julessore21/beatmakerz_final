"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/apiUrl";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import { useOffers } from "@/lib/useOffers";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";

const GENRES = ["Trap", "Drill", "Cloud", "Lofi", "Boom bap", "Afro", "R&B", "Rage", "Pop urbaine", "Autre"];
const MOODS = ["Sombre", "Mélancolique", "Énergique", "Planant", "Agressif", "Chill", "Épique", "Festif"];

export function CustomProd() {
  const params = useSearchParams();
  const { user } = useAuth();
  const { custom } = useOffers();
  const price = custom?.priceCents != null ? formatPrice(custom.priceCents, custom.currency) : null;

  const [genre, setGenre] = useState("");
  const [moods, setMoods] = useState<string[]>([]);
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [instruments, setInstruments] = useState("");
  const [brief, setBrief] = useState("");
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user?.email, email]);

  if (params.get("success") === "true")
    return (
      <div className="container-site flex min-h-[60vh] flex-col items-center justify-center text-center">
        <CheckCircle2 className="h-12 w-12 text-accent" />
        <h1 className="mt-6 text-[32px] font-semibold tracking-[-0.02em]">C’est parti pour ta prod.</h1>
        <p className="mt-3 max-w-md text-fg-muted">Paiement reçu et brief bien arrivé. On te recontacte par mail pour la suite et la livraison.</p>
        <p className="mt-2 text-[14px] text-fg-faint">Une question en attendant : {SITE.email}</p>
        <ButtonLink href="/web/catalogue" variant="secondary" className="mt-8">
          Écouter le catalogue
        </ButtonLink>
      </div>
    );

  const toggleMood = (m: string) => setMoods((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : cur.length < 3 ? [...cur, m] : cur));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!genre) return setError("Choisis un genre.");
    if (brief.trim().length < 10) return setError("Décris ta prod en quelques mots (10 caractères au moins).");
    if (bpm && (!/^\d{2,3}$/.test(bpm) || Number(bpm) < 50 || Number(bpm) > 220)) return setError("Le tempo se donne entre 50 et 220 BPM.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Il nous faut ton adresse mail pour te livrer la prod.");
    if (reference && !/^https?:\/\//i.test(reference.trim())) return setError("La référence doit être un lien (YouTube, TikTok, Spotify…).");
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/checkout/custom-prod`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          genre,
          style: moods.join(", ") || undefined,
          bpm: bpm || undefined,
          key: key.trim() || undefined,
          instruments: instruments.trim() || undefined,
          brief: brief.trim(),
          file: reference.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string };
      if (!res.ok || !data.url) throw new Error();
      window.location.href = data.url;
    } catch {
      setError("Le paiement ne se lance pas pour le moment. Réessaie dans un instant.");
      setBusy(false);
    }
  };

  return (
    <div className="container-site pt-10 sm:pt-14">
      {params.get("canceled") === "true" && <p className="mb-8 rounded-xl border border-line bg-ink-850 px-4 py-3 text-[14px] text-fg-muted">Paiement annulé, rien n’a été débité. Ton brief est à refaire ci-dessous.</p>}

      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow mb-4">Prod sur mesure</p>
          <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[52px]">Une prod faite pour ta voix.</h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-fg-muted">Tu donnes le genre, le tempo, l’ambiance et tes références. On compose une prod rien que pour toi.</p>
          <p className="mt-8 flex items-baseline gap-2">
            <span className="text-[44px] font-semibold tracking-[-0.03em] tabular-nums">{price ?? "—"}</span>
            {price && <span className="text-fg-muted">la prod</span>}
          </p>
          <ul className="mt-8 space-y-3 border-t border-line pt-8">
            {["Licence exclusive : elle n’est vendue qu’à toi", "Contrat de cession fourni", "Jamais remise en vente sur le site", "Suivi par mail, du brief à la livraison"].map((p) => (
              <li key={p} className="flex gap-3 text-[15px] text-fg-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={(e) => void submit(e)} className="card space-y-8 p-6 sm:p-8" noValidate>
          <Step n={1} title="Le genre">
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Pill key={g} on={genre === g} onClick={() => setGenre(g)}>
                  {g}
                </Pill>
              ))}
            </div>
          </Step>

          <Step n={2} title="L’ambiance" hint="Jusqu’à trois">
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Pill key={m} on={moods.includes(m)} onClick={() => toggleMood(m)}>
                  {m}
                </Pill>
              ))}
            </div>
          </Step>

          <Step n={3} title="Le son">
            <div className="grid gap-3 sm:grid-cols-3">
              <Labeled label="Tempo (BPM)">
                <input className="field" inputMode="numeric" value={bpm} onChange={(e) => setBpm(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="140" />
              </Labeled>
              <Labeled label="Tonalité">
                <input className="field" value={key} onChange={(e) => setKey(e.target.value.slice(0, 12))} placeholder="Facultatif" />
              </Labeled>
              <Labeled label="Instruments">
                <input className="field" value={instruments} onChange={(e) => setInstruments(e.target.value.slice(0, 200))} placeholder="Piano, 808…" />
              </Labeled>
            </div>
          </Step>

          <Step n={4} title="Ta prod en quelques mots">
            <textarea className="field" value={brief} onChange={(e) => setBrief(e.target.value.slice(0, 2000))} placeholder="Le thème du morceau, l’énergie, ce que tu veux entendre…" />
            <div className="mt-3">
              <Labeled label="Une référence (lien)">
                <input className="field" value={reference} onChange={(e) => setReference(e.target.value.slice(0, 500))} placeholder="https://youtube.com/…" inputMode="url" />
              </Labeled>
            </div>
          </Step>

          <Step n={5} title="Ton adresse mail" hint="Pour te livrer la prod">
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="toi@exemple.fr" />
          </Step>

          {error && <p className="rounded-lg bg-white/[0.05] px-3 py-2.5 text-[14px]">{error}</p>}
          <div className="border-t border-line pt-6">
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {price ? `Payer ${price} et envoyer le brief` : "Payer et envoyer le brief"}
            </Button>
            <p className="mt-3 text-center text-[12px] text-fg-faint">Paiement sécurisé par Stripe. Ton brief part avec le paiement.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-baseline gap-3">
        <span className="meta">0{n}</span>
        <span className="text-[16px] font-medium">{title}</span>
        {hint && <span className="text-[13px] text-fg-faint">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className={cn("h-9 rounded-full border px-4 text-[14px] transition-colors", on ? "border-fg bg-fg text-ink" : "border-line text-fg-muted hover:border-line-strong hover:text-fg")}>
      {children}
    </button>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] text-fg-muted">{label}</span>
      {children}
    </label>
  );
}
