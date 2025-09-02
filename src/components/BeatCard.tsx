"use client";

import { motion } from "framer-motion";
import { Music2, Flame, Star, Crown } from "lucide-react";
import ActionBar from "./ActionBar";
import { useCart } from "@/context/CartContext";

export type Tag = "Tendance" | "Nouveau" | "Populaire";

export type BeatCardProps = {
  id: number | string;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  keySig: string;
  price: number;
  tag?: Tag;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlayPause: () => void;
  onAdd?: () => void;
  onFav?: () => void;
  onMore?: () => void;
  showTag?: boolean;
};

const chip =
  "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[0.65rem] text-zinc-400 align-middle";

export default function BeatCard({
  id,
  name,
  artist,
  genre,
  bpm,
  keySig,
  price,
  tag,
  isCurrent,
  isPlaying,
  onPlayPause,
  onAdd,
  onFav,
  onMore,
}: BeatCardProps) {
  const { addItem } = useCart();

  const bgForGenre = (g: string): string | null => {
    const s = g.toLowerCase();
    if (s.includes("trap")) return "/img/trap.png";
    if (s.includes("r&b") || s.includes("rnb") || s.includes("rb")) return "/img/rnb.png";
    if (s.includes("new wave")) return "/img/newwave.png";
    if (s.includes("mélan") || s.includes("melan")) return "/img/melancolique.png";
    return null;
  };
  const bgSrc = bgForGenre(genre);

  const handleAdd = () => {
    addItem({ id, name, price });
    onAdd?.();
  };
  const handleFav = () => {
    onFav?.();
    try {
      const raw = localStorage.getItem("favs:data") || "{}";
      const map = JSON.parse(raw);
      map[id as number] = { id, name, artist, price };
      localStorage.setItem("favs:data", JSON.stringify(map));
    } catch {}
  };
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="group relative mx-[-4px] overflow-hidden rounded-2xl border border-white/10 shadow-xl aspect-square"
    >
      {/* background image/gradient */}
      {bgSrc ? (
        <img
          src={bgSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover blur-[2px] brightness-[.75] scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#141416] to-[#0b0b12]" />
      )}
      <div className="absolute inset-0 bg-black/50" />

      {/* overlay content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-start justify-end">
          <div className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs text-white">
            {price.toFixed(2)}€
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{name}</h3>
          <div className="truncate text-[11px] text-zinc-300/90">{artist}</div>
          <div className="mt-2 flex items-center justify-center gap-[6px]">
            <span className="shrink-0 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-0.5 text-[9px] text-zinc-200 whitespace-nowrap">🎵 {genre}</span>
            <span className="shrink-0 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[9px] text-zinc-200 whitespace-nowrap">⏱ {bpm} BPM</span>
            <span className="shrink-0 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[9px] text-zinc-200 whitespace-nowrap">🎹 {keySig}</span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <ActionBar
              size="sm"
              isCurrent={isCurrent}
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onAdd={handleAdd}
              onFav={handleFav}
              onMore={onMore}
            />
            {tag && (typeof showTag === "undefined" ? true : showTag) && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[0.68rem] text-zinc-200">
                {tag === "Tendance" && <Flame className="h-3 w-3 text-orange-400" />}
                {tag === "Nouveau" && <Star className="h-3 w-3 text-yellow-300" />}
                {tag === "Populaire" && <Crown className="h-3 w-3 text-amber-300" />}
                {tag}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
