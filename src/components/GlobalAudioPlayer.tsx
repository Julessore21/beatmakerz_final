"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music2,
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
  } = useAudio();

  const shown = !!track;
  const muted = volume <= 0.001;

  return (
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

        <div className="flex items-center gap-4 px-4 py-3">
          <div className=" text-white flex h-12 w-12 items-center justify-center rounded-lg border white border-white/10 bg-white/5">
            <Music2 size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-white text-sm font-semibold">
              {track?.name || "Aucun titre"}
            </div>
            <div className="truncate text-xs text-zinc-400">
              {track?.artist || "—"}
            </div>
          </div>

          <div className="hidden md:block text-[11px] text-zinc-400 tabular-nums">
            {fmt(currentTime)} / {fmt(duration)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="rounded-full p-2 text-white hover:bg-white/10"
              aria-label="Précédent"
            >
              <SkipBack size={18} />
            </button>
            <button
              onClick={toggle}
              className="rounded-full p-2 px-3 font-semibold text-white hover:bg-white/10"
              aria-label={isPlaying ? "Pause" : "Lecture"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              onClick={next}
              className="rounded-full p-2 text-white hover:bg-white/10"
              aria-label="Suivant"
            >
              <SkipForward size={18} />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-36">
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
              className="w-full accent-[#7C5CFF]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalAudioPlayer;
