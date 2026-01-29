"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAudio } from "@/context/AudioPlayerContext";

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${r}`;
};

const GlobalAudioPlayer: React.FC = () => {
  const {
    track,
    isPlaying,
    toggle,
    next,
    prev,
    progress,
    seek,
    volume,
    setVolume,
    duration,
    currentTime,
    pause,
  } = useAudio();

  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("bm_player_collapsed") === "1";
  });
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bm_player_collapsed", collapsed ? "1" : "0");
    }
  }, [collapsed]);

  // Quand le morceau change, on ré-affiche si précédemment fermé
  React.useEffect(() => {
    if (track) setDismissed(false);
  }, [track]);

  const hasTrack = !!track;
  const shown = hasTrack && !dismissed && !collapsed;
  const muted = volume <= 0.001;

  return (
    <>
      {hasTrack && !dismissed && (
      <motion.div
        initial={false}
        animate={{ y: shown ? 0 : 100 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed inset-x-0 bottom-4 z-50 flex justify-center pointer-events-none"
      >
      <div className="pointer-events-auto w-[min(960px,94vw)] rounded-2xl border border-white/10 bg-black/80 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,.6)]">
        {/* Progress/global seek */}
        <div
          className="h-1.5 rounded-t-2xl bg-white/10 cursor-pointer"
          onClick={(e) => {
            const rect = (e.target as HTMLDivElement).getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seek(ratio);
          }}
        >
          <div
            className="h-full rounded-t-2xl bg-gradient-to-r from-[#7C5CFF] to-[#9f8cff]"
            style={{ width: `${(progress || 0) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3">
          {/* Close button */}
          <button
            onClick={() => {
              setDismissed(true);
              pause();
            }}
            className="rounded-md p-1 sm:p-1.5 hover:bg-white/10 text-white shrink-0"
            aria-label="Fermer le lecteur"
          >
            <X size={14} />
          </button>

          <div className="hidden xs:flex text-white h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 shrink-0">
            <Music2 size={16} className="sm:hidden" />
            <Music2 size={18} className="hidden sm:block" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-white text-xs sm:text-sm font-semibold">
              {track?.name || "Aucun titre"}
            </div>
            <div className="truncate text-[10px] sm:text-xs text-zinc-400">
              {track?.artist || "—"}
            </div>
          </div>

          <div className="hidden md:block text-[11px] text-zinc-400 tabular-nums shrink-0">
            {fmt(currentTime)} / {fmt(duration)}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={prev}
              className="hidden xs:block rounded-full p-1.5 sm:p-2 text-white hover:bg-white/10"
              aria-label="Précédent"
            >
              <SkipBack size={16} className="sm:hidden" />
              <SkipBack size={18} className="hidden sm:block" />
            </button>
            <button
              onClick={toggle}
              className="rounded-full p-1.5 px-2 sm:p-2 sm:px-3 font-semibold text-white hover:bg-white/10"
              aria-label={isPlaying ? "Pause" : "Lecture"}
            >
              {isPlaying ? <Pause size={16} className="sm:hidden" /> : <Play size={16} className="sm:hidden" />}
              {isPlaying ? <Pause size={18} className="hidden sm:block" /> : <Play size={18} className="hidden sm:block" />}
            </button>
            <button
              onClick={next}
              className="hidden xs:block rounded-full p-1.5 sm:p-2 text-white hover:bg-white/10"
              aria-label="Suivant"
            >
              <SkipForward size={16} className="sm:hidden" />
              <SkipForward size={18} className="hidden sm:block" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-28 lg:w-36 shrink-0">
            <button
              onClick={() => setVolume(muted ? 0.8 : 0)}
              className="rounded-md p-1 hover:bg-white/10"
              aria-label="Volume"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full volume-purple"
            />
          </div>

          {/* Collapse button (arrow down) */}
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-md p-1 hover:bg-white/10 text-white shrink-0"
            aria-label="Réduire"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
      </motion.div>
      )}

      {/* Floating expand button when collapsed */}
      <AnimatePresence>
        {hasTrack && !dismissed && collapsed && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={() => setCollapsed(false)}
            className="fixed bottom-4 right-4 z-50 rounded-full border border-white/10 bg-black/70 p-2 text-white backdrop-blur hover:bg-black/60"
            aria-label="Déployer le lecteur"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalAudioPlayer;
