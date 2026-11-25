"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Link2, Loader2 } from "lucide-react";
import { useAudio } from "@/context/AudioPlayerContext";
import { useCart } from "@/context/CartContext";
import { cheapest, fetchBeat, FORMAT_LABEL, type Beat, type BeatPrice } from "@/lib/catalog";
import { formatPrice, formatTime } from "@/lib/format";
import { useCatalog } from "@/lib/useCatalog";
import { useOffers } from "@/lib/useOffers";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { AddToCart } from "@/components/shop/AddToCart";
import { Cover } from "@/components/shop/Cover";
import { EqBars, PlayToggle } from "@/components/shop/PlayToggle";
import { TrackList } from "@/components/shop/TrackList";

export function BeatView({ id, initial }: { id: string; initial: Beat | null }) {
  const [beat, setBeat] = useState<Beat | null | undefined>(initial ?? undefined);
  const [failed, setFailed] = useState(false);
  const { beats } = useCatalog();

  // L'API dormait pendant le rendu serveur : on relit la prod depuis le navigateur.
  useEffect(() => {
    if (initial) return;
    fetchBeat(id)
      .then((b) => setBeat(b))
      .catch(() => setFailed(true));
  }, [id, initial]);

  const similar = useMemo(() => {
    if (!beat || !beats) return [];
    const others = beats.filter((b) => b.id !== beat.id);
    const same = others.filter((b) => b.genres.some((g) => beat.genres.includes(g)));
    return (same.length >= 3 ? same : others).slice(0, 6);
  }, [beat, beats]);

  if (beat === undefined)
    return (
      <div className="container-site grid min-h-[50vh] place-items-center">
        {failed ? (
          <p className="text-fg-muted">
            La prod ne se charge pas pour le moment.{" "}
            <button type="button" className="underline underline-offset-4" onClick={() => location.reload()}>
              Réessayer
            </button>
          </p>
        ) : (
          <Loader2 className="h-6 w-6 animate-spin text-fg-faint" />
        )}
      </div>
    );

  if (beat === null)
    return (
      <div className="container-site flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-[22px] font-semibold">Cette prod n’est plus en vente.</p>
        <p className="text-fg-muted">Elle a peut-être été achetée en exclusivité. Le catalogue en a plein d’autres.</p>
        <ButtonLink href="/web/catalogue">Voir le catalogue</ButtonLink>
      </div>
    );

  return (
    <div className="container-site pt-8 sm:pt-12">
      <Link href="/web/catalogue" className="inline-flex items-center gap-1.5 text-[14px] text-fg-muted hover:text-fg">
        <ArrowLeft className="h-4 w-4" />
        Catalogue
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-14">
        <Artwork beat={beat} queue={similar.length ? [beat, ...similar] : [beat]} />
        <div>
          {beat.genres.length > 0 && <p className="eyebrow">{beat.genres.join(" · ")}</p>}
          <h1 className="mt-3 text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">{beat.title}</h1>
          <p className="mt-2 text-fg-muted">Prod. {beat.artist}</p>

          <dl className="mt-8 grid grid-cols-3 divide-x divide-line rounded-card border border-line bg-ink-850">
            <Stat label="Tempo" value={beat.bpm ? `${beat.bpm} BPM` : "—"} />
            <Stat label="Tonalité" value={beat.key ?? "—"} />
            <Stat label="Extrait" value={beat.previewSeconds ? formatTime(beat.previewSeconds) : "—"} />
          </dl>

          {beat.moods.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {beat.moods.map((m) => (
                <span key={m} className="rounded-full border border-line px-3 py-1 text-[13px] text-fg-muted">
                  {m}
                </span>
              ))}
            </div>
          )}

          <LicenseBox beat={beat} />
        </div>
      </div>

      {similar.length > 0 && (
        <section className="pt-20">
          <h2 className="mb-6 text-[24px] font-semibold tracking-[-0.02em]">Dans le même style</h2>
          <TrackList beats={similar} numbered={false} />
        </section>
      )}
    </div>
  );
}

function Artwork({ beat, queue }: { beat: Beat; queue: Beat[] }) {
  const { track, isPlaying, currentTime, duration, seek } = useAudio();
  const current = track?.id === beat.id;
  const pct = current && duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div>
      <Cover id={beat.id} url={beat.coverUrl} title={beat.title} genres={beat.genres} bpm={beat.bpm} keyName={beat.key} className="w-full rounded-[20px] border border-line" />
      <div className="mt-4 flex items-center gap-3">
        <PlayToggle beat={beat} queue={queue} size="lg" />
        {current && isPlaying && <EqBars className="h-4" />}
        <span className="meta w-9 text-right">{formatTime(current ? currentTime : 0)}</span>
        <input
          type="range"
          className="range flex-1"
          min={0}
          max={current ? duration || 0 : 0}
          step={0.1}
          value={current ? currentTime : 0}
          disabled={!current}
          onChange={(e) => seek(Number(e.target.value))}
          style={{ ["--fill" as string]: `${pct}%` }}
          aria-label="Position dans l’extrait"
        />
        <span className="meta w-9">{formatTime(current ? duration : beat.previewSeconds ?? 0)}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4 sm:px-5">
      <dt className="eyebrow text-[11px]">{label}</dt>
      <dd className="mt-1.5 font-mono text-[15px] tabular-nums">{value}</dd>
    </div>
  );
}

function LicenseBox({ beat }: { beat: Beat }) {
  const { licenses } = useOffers();
  const { lines } = useCart();
  const inCart = lines.find((l) => l.beatId === beat.id);
  const [chosen, setChosen] = useState<BeatPrice | null>(() => (inCart && beat.prices.find((p) => p.licenseTypeId === inCart.licenseTypeId)) || cheapest(beat));
  const [copied, setCopied] = useState(false);
  const license = licenses?.find((l) => l.id === chosen?.licenseTypeId);
  const files = license ? license.files.filter((f) => beat.formats.includes(f)) : beat.formats.filter((f) => f !== "stems");

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: beat.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* partage annulé */
    }
  };

  return (
    <div className="mt-8 rounded-card border border-line-strong bg-ink-800 p-6 sm:p-7">
      {beat.prices.length > 1 && (
        <div className="mb-6 grid gap-2" role="radiogroup" aria-label="Licence">
          {beat.prices.map((p) => (
            <button
              key={p.licenseTypeId}
              type="button"
              role="radio"
              aria-checked={chosen?.licenseTypeId === p.licenseTypeId}
              onClick={() => setChosen(p)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                chosen?.licenseTypeId === p.licenseTypeId ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong",
              )}
            >
              <span className="font-medium">Licence {p.code}</span>
              <span className="font-mono tabular-nums">{formatPrice(p.priceCents, p.currency)}</span>
            </button>
          ))}
        </div>
      )}

      {chosen ? (
        <>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-medium">Licence {chosen.code}</p>
            <p className="text-[30px] font-semibold tracking-[-0.02em] tabular-nums">{formatPrice(chosen.priceCents, chosen.currency)}</p>
          </div>
          <ul className="mt-5 space-y-2.5 text-[14px] text-fg-muted">
            {files.length > 0 && <Point>Fichiers : {files.map((f) => FORMAT_LABEL[f] ?? f).join(" + ")}</Point>}
            <Point>Usage commercial : streaming, clips, scène</Point>
            <Point>Non exclusive, revente de la prod interdite</Point>
            <Point>Téléchargement dans ton compte dès le paiement</Point>
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <AddToCart beat={beat} price={chosen} size="lg" className="w-full sm:w-auto sm:flex-1" />
            <button type="button" onClick={() => void share()} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line-strong px-5 text-[15px] hover:bg-white/[0.06]">
              {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              {copied ? "Lien copié" : "Partager"}
            </button>
          </div>
        </>
      ) : (
        <div>
          <p className="font-medium">Pas encore en vente</p>
          <p className="mt-1 text-[14px] text-fg-muted">Les fichiers de cette prod arrivent. En attendant, tu peux demander une prod sur mesure.</p>
          <ButtonLink href="/web/prodsurmesure" variant="secondary" className="mt-5">
            Prod sur mesure
          </ButtonLink>
        </div>
      )}
      <p className="mt-6 border-t border-line pt-5 text-[13px] text-fg-faint">
        Tu veux cette prod en exclusivité ?{" "}
        <Link href="/web/contact" className="text-fg-muted underline underline-offset-4 hover:text-fg">
          Écris-nous
        </Link>
        .
      </p>
    </div>
  );
}

function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
      <span>{children}</span>
    </li>
  );
}
