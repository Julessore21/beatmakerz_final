"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Heart,
  Plus,
  MoreVertical,
  Music2,
  Sparkles,
} from "lucide-react";

export type BeatCardProps = {
  id: number;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  keySig: string;
  tag?: "Tendance" | "Nouveau" | "Populaire" | null;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlayPause: () => void;
  onAdd?: () => void;
  onFav?: () => void;
  onMore?: () => void;
};

const pill =
  "rounded-lg border border-white/10 bg-white/5 text-[11px] px-2 py-1 text-zinc-200";

const tagColor: Record<string, string> = {
  Tendance: "from-[#7C5CFF] to-[#9f8cff]",
  Nouveau: "from-emerald-500 to-emerald-300",
  Populaire: "from-rose-500 to-pink-400",
};

export default function BeatCard({
  id,
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
  const tagClass = useMemo(
    () =>
      tag
        ? `bg-gradient-to-r ${
            tagColor[tag] ?? "from-zinc-600 to-zinc-400"
          } text-[10px] font-semibold text-black px-2 py-0.5 rounded-full`
        : "",
    [tag]
  );

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#241e33]/60 to-[#161522]/60 p-4 shadow-xl"
    >
      {/* décor angle */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#7C5CFF]/10 blur-2xl" />

      {/* top row */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <Music2 size={18} className="text-zinc-300" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{name}</h3>
            {tag && (
              <span className={tagClass}>
                <span className="inline-flex items-center gap-1">
                  <Sparkles size={12} />
                  {tag}
                </span>
              </span>
            )}
          </div>
          <div className="truncate text-xs text-zinc-400">{artist}</div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onFav}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-white/10"
            aria-label="Favori"
          >
            <Heart size={16} />
          </button>
          <button
            onClick={onMore}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-white/10"
            aria-label="Plus"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* meta pills */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={pill}>Genre {genre}</span>
        <span className={pill}>BPM {bpm}</span>
        <span className={pill}>Key {keySig}</span>
      </div>

      {/* actions */}
      <div className="mt-4 flex items-center justify-between">
        {/* Play / Pause circulaire */}
        <motion.button
          onClick={onPlayPause}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 rounded-full border px-3 py-2 transition-colors
            ${
              isCurrent
                ? "border-[#7C5CFF] bg-[#7C5CFF] text-white"
                : "border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10"
            }`}
          aria-label={isPlaying && isCurrent ? "Pause" : "Lecture"}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/30">
            {isPlaying && isCurrent ? <Pause size={16} /> : <Play size={16} />}
          </span>
          {isPlaying && isCurrent ? "Pause" : "Écouter"}
        </motion.button>

        <motion.button
          onClick={onAdd}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-zinc-100 hover:bg-white/10"
          aria-label="Ajouter"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/30">
            <Plus size={16} />
          </span>
          Ajouter
        </motion.button>
      </div>

      {/* Now playing badge */}
      <motion.div
        initial={false}
        animate={{ opacity: isCurrent ? 1 : 0, y: isCurrent ? 0 : -6 }}
        className="pointer-events-none absolute left-3 top-3"
      >
        {isCurrent && <NowPlaying />}
      </motion.div>
    </motion.div>
  );
}

/* ------- petit égaliseur animé (framer-motion) ------- */
function NowPlaying() {
  const bar = {
    hidden: { scaleY: 0.2, opacity: 0.8 },
    show: (i: number) => ({
      scaleY: [0.2, 1, 0.4, 0.9, 0.2],
      transition: {
        duration: 1.1 + i * 0.05,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[10px] text-white/90 backdrop-blur">
      <div className="flex h-3 w-4 items-end gap-[2px]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            variants={bar}
            initial="hidden"
            animate="show"
            className="h-full w-[2px] origin-bottom rounded-sm bg-white/70"
          />
        ))}
      </div>
      Now playing
    </div>
  );
}
