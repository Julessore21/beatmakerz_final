"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAudio } from "@/context/AudioPlayerContext";
import type { Beat } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { AddToCart } from "./AddToCart";
import { Cover } from "./Cover";
import { EqBars, PlayToggle } from "./PlayToggle";

/** Liste de prods façon lecteur de musique : écouter, voir le détail, ajouter au panier, sans quitter la ligne. */
export function TrackList({ beats, numbered = true, className }: { beats: Beat[]; numbered?: boolean; className?: string }) {
  return (
    <div className={cn("divide-y divide-line overflow-hidden rounded-card border border-line bg-ink-850", className)} role="list">
      <div className="hidden grid-cols-[2.5rem_minmax(0,1fr)_7rem_4.5rem_4rem_6.5rem] items-center gap-4 px-4 py-2.5 md:grid" aria-hidden="true">
        <span className="eyebrow text-[11px]">{numbered ? "#" : ""}</span>
        <span className="eyebrow text-[11px]">Prod</span>
        <span className="eyebrow text-[11px]">Genre</span>
        <span className="eyebrow text-right text-[11px]">BPM</span>
        <span className="eyebrow text-right text-[11px]">Clé</span>
        <span className="eyebrow text-right text-[11px]">Prix</span>
      </div>
      {beats.map((b, i) => (
        <TrackRow key={b.id} beat={b} index={i} queue={beats} numbered={numbered} />
      ))}
    </div>
  );
}

function TrackRow({ beat, index, queue, numbered }: { beat: Beat; index: number; queue: Beat[]; numbered: boolean }) {
  const { track, isPlaying } = useAudio();
  const router = useRouter();
  const current = track?.id === beat.id;
  const href = `/web/prod/${beat.id}`;
  return (
    <div
      role="listitem"
      onClick={() => router.push(href)}
      className={cn(
        "group grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 transition-colors sm:gap-4 sm:px-4 md:grid-cols-[2.5rem_minmax(0,1fr)_7rem_4.5rem_4rem_6.5rem]",
        current ? "bg-accent-soft/60" : "hover:bg-white/[0.03]",
      )}
    >
      <div className="relative grid h-10 w-10 place-items-center md:h-9 md:w-9">
        {/* Le numéro (ou les barres de la prod qui joue) laisse place au bouton au survol et au clavier. */}
        {numbered && !(current && isPlaying) && (
          <span className={cn("meta hidden text-[13px] transition-opacity md:block md:group-focus-within:opacity-0 md:group-hover:opacity-0", current && "md:opacity-0")}>{String(index + 1).padStart(2, "0")}</span>
        )}
        {current && isPlaying && <EqBars className="absolute hidden transition-opacity md:inline-flex md:group-focus-within:opacity-0 md:group-hover:opacity-0" />}
        <div
          className={cn(
            "absolute inset-0 grid place-items-center transition-opacity",
            (numbered || (current && isPlaying)) && "md:opacity-0 md:focus-within:opacity-100 md:group-hover:opacity-100",
            current && !isPlaying && "md:opacity-100",
          )}
        >
          <PlayToggle beat={beat} queue={queue} />
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <Cover id={beat.id} url={beat.coverUrl} title={beat.title} genres={beat.genres} className="h-11 w-11 shrink-0 rounded-md" />
        <div className="min-w-0">
          <Link href={href} onClick={(e) => e.stopPropagation()} className={cn("block truncate text-[15px] font-medium leading-snug hover:underline", current && "text-accent")}>
            {beat.title}
          </Link>
          <p className="meta mt-0.5 truncate md:hidden">{[beat.genres[0], beat.bpm ? `${beat.bpm} BPM` : null, beat.key].filter(Boolean).join(" · ")}</p>
          <p className="mt-0.5 hidden truncate text-[13px] text-fg-faint md:block">{beat.artist}</p>
        </div>
      </div>

      <span className="hidden truncate text-[13px] text-fg-muted md:block">{beat.genres.slice(0, 2).join(", ") || "—"}</span>
      <span className="meta hidden text-right md:block">{beat.bpm ?? "—"}</span>
      <span className="meta hidden text-right md:block">{beat.key ?? "—"}</span>
      <div className="flex justify-end">
        <AddToCart beat={beat} />
      </div>
    </div>
  );
}

/** Lignes fantômes pendant le chargement (même hauteur que les vraies : rien ne saute). */
export function TrackListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-ink-850" aria-busy="true" aria-label="Chargement des prods">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-2.5">
          <div className="skeleton h-9 w-9 rounded-full" />
          <div className="skeleton h-11 w-11 rounded-md" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-40" />
            <div className="skeleton h-3 w-24" />
          </div>
          <div className="skeleton h-8 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
