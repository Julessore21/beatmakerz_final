"use client";

import { Loader2, Pause, Play } from "lucide-react";
import { useAudio } from "@/context/AudioPlayerContext";
import type { Beat } from "@/lib/catalog";
import { cn } from "@/lib/cn";

/** Trois barres qui bougent : la prod qui joue. */
export function EqBars({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex h-3.5 items-end gap-[2px]", className)} aria-hidden="true">
      {[0, 0.2, 0.4].map((d) => (
        <span key={d} className="h-full w-[3px] origin-bottom animate-bars rounded-full bg-accent" style={{ animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}

/** Lecture / pause d'une prod, à l'endroit où on la voit. */
export function PlayToggle({ beat, queue, size = "md", className }: { beat: Beat; queue?: Beat[]; size?: "md" | "lg"; className?: string }) {
  const { track, isPlaying, isLoading, toggle } = useAudio();
  const current = track?.id === beat.id;
  const playing = current && isPlaying;
  const disabled = !beat.previewUrl;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        toggle(beat, queue);
      }}
      aria-label={disabled ? "Pas d’extrait" : playing ? `Mettre en pause ${beat.title}` : `Écouter ${beat.title}`}
      className={cn(
        "grid shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-150 active:scale-95 disabled:opacity-40",
        size === "lg" ? "h-14 w-14 bg-fg text-ink hover:bg-white/85" : "h-9 w-9 bg-white/[0.08] text-fg hover:bg-white/[0.16]",
        className,
      )}
    >
      {current && isLoading ? (
        <Loader2 className={cn("animate-spin", size === "lg" ? "h-6 w-6" : "h-4 w-4")} />
      ) : playing ? (
        <Pause className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} fill="currentColor" strokeWidth={0} />
      ) : (
        <Play className={cn(size === "lg" ? "h-6 w-6" : "h-4 w-4", "translate-x-[1px]")} fill="currentColor" strokeWidth={0} />
      )}
    </button>
  );
}
