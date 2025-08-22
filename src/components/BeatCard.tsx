"use client";

import { motion } from "framer-motion";
import { Music2, Sparkles } from "lucide-react";
import ActionBar from "./ActionBar";

export type Tag = "Tendance" | "Nouveau" | "Populaire";

export type BeatCardProps = {
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  keySig: string;
  tag?: Tag;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlayPause: () => void;
  onAdd?: () => void;
  onFav?: () => void;
  onMore?: () => void;
};

const chip =
  "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[0.65rem] text-zinc-400 align-middle";

export default function BeatCard({
  name,
  artist,
  genre,
  bpm,
  keySig,
  tag,
  isCurrent,
  isPlaying,
  onPlayPause,
  onAdd,
  onFav,
  onMore,
}: BeatCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#241e33]/60 to-[#161522]/60 p-4 shadow-xl"
    >
      {/* glow décoratif */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl" />

      {/* BADGE calé en haut à droite */}
      {tag && (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[0.68rem] text-zinc-200">
          <Sparkles className="h-3 w-3" />
          {tag}
        </span>
      )}

      {/* header */}
      <div className="flex items-start gap-3 pr-16">
        {/* pr pour ne pas passer sous le badge */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Music2 className="h-8 w-8 text-zinc-300" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{name}</h3>
          <div className="truncate text-xs text-zinc-400">{artist}</div>
        </div>
      </div>

      {/* CATEGORIES → 1 seule ligne + fade droite */}
      <div className="relative mt-2">
        <div className="flex flex-nowrap gap-1.5 overflow-hidden whitespace-nowrap pr-6">
          <span className={chip}>🎵 {genre}</span>
          <span className={chip}>⏱ {bpm} BPM</span>
          <span className={chip}>🎹 {keySig}</span>
        </div>
        {/* petit fade à droite pour indiquer qu'il y a plus */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[rgba(22,21,34,0.9)] to-transparent" />
      </div>

      {/* actions minimalistes */}
      <div className="mt-4">
        <ActionBar
          size="sm"
          isCurrent={isCurrent}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onAdd={onAdd}
          onFav={onFav}
          onMore={onMore}
        />
      </div>
    </motion.div>
  );
}
