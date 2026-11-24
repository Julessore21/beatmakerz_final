"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import { useAudio } from "@/context/AudioPlayerContext";
import { formatTime } from "@/lib/format";
import { AddToCart } from "./AddToCart";
import { Cover } from "./Cover";

/** Le lecteur collé en bas de l'écran, sur tout le site, dès qu'une prod a été lancée. */
export function PlayerBar() {
  const { track, isPlaying, error, currentTime, duration, volume, toggle, next, prev, seek, setVolume, close } = useAudio();
  const ref = useRef<HTMLDivElement>(null);

  // Le contenu de la page ne passe jamais sous le lecteur.
  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!track || !el) {
      root.style.setProperty("--player-h", "0px");
      return;
    }
    const set = () => root.style.setProperty("--player-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--player-h", "0px");
    };
  }, [track]);

  if (!track) return null;
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  return (
    <div ref={ref} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink-850/90 backdrop-blur-xl" role="region" aria-label="Lecteur">
      {/* Progression pleine largeur, cliquable, au-dessus de la barre (téléphone). */}
      <input
        type="range"
        className="range absolute inset-x-0 -top-[2px] block w-full sm:hidden"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
        style={{ ["--fill" as string]: `${pct}%` }}
        aria-label="Position dans l’extrait"
      />
      <div className="container-site flex h-[68px] items-center gap-3 sm:h-[76px] sm:gap-5">
        <Link href={`/web/prod/${track.id}`} className="flex min-w-0 flex-1 items-center gap-3 sm:w-72 sm:flex-none">
          <Cover id={track.id} url={track.coverUrl} title={track.title} className="h-11 w-11 shrink-0 rounded-md" />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium">{track.title}</p>
            <p className="meta truncate">{error ?? [track.bpm ? `${track.bpm} BPM` : null, track.key, track.genres[0]].filter(Boolean).join(" · ")}</p>
          </div>
        </Link>

        <div className="hidden flex-1 flex-col items-center gap-1.5 sm:flex">
          <div className="flex items-center gap-4">
            <button type="button" onClick={prev} className="text-fg-muted transition-colors hover:text-fg" aria-label="Précédente">
              <SkipBack className="h-4 w-4" fill="currentColor" />
            </button>
            <button type="button" onClick={() => toggle()} className="grid h-9 w-9 place-items-center rounded-full bg-fg text-ink transition-transform active:scale-95" aria-label={isPlaying ? "Pause" : "Lecture"}>
              {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" strokeWidth={0} /> : <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" strokeWidth={0} />}
            </button>
            <button type="button" onClick={next} className="text-fg-muted transition-colors hover:text-fg" aria-label="Suivante">
              <SkipForward className="h-4 w-4" fill="currentColor" />
            </button>
          </div>
          <div className="flex w-full max-w-xl items-center gap-3">
            <span className="meta w-9 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="range flex-1"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              style={{ ["--fill" as string]: `${pct}%` }}
              aria-label="Position dans l’extrait"
            />
            <span className="meta w-9">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:w-72 sm:justify-end sm:gap-3">
          <button type="button" onClick={() => toggle()} className="grid h-10 w-10 place-items-center rounded-full bg-fg text-ink sm:hidden" aria-label={isPlaying ? "Pause" : "Lecture"}>
            {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" strokeWidth={0} /> : <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" strokeWidth={0} />}
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <button type="button" onClick={() => setVolume(volume > 0 ? 0 : 0.8)} className="text-fg-muted hover:text-fg" aria-label={volume > 0 ? "Couper le son" : "Remettre le son"}>
              {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <input type="range" className="range w-20" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} style={{ ["--fill" as string]: `${volume * 100}%` }} aria-label="Volume" />
          </div>
          <div className="hidden sm:block">
            <AddToCart beat={track} />
          </div>
          <button type="button" onClick={close} className="hidden text-fg-faint hover:text-fg sm:block" aria-label="Fermer le lecteur">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
