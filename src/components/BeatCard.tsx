"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import { Music2, Flame, Star, Crown } from "lucide-react";
import ActionBar from "./ActionBar";
import { useCart } from "@/context/CartContext";
import { toggleFavorite } from "@/lib/services/user-api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

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
  isFav?: boolean;
};

const chipClass =
  "inline-flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[10px] sm:text-[11px] text-zinc-200";

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
  showTag = true,
  isFav = false,
}: BeatCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [fav, setFav] = useState<boolean>(isFav);

  useEffect(() => setFav(isFav), [isFav]);

  const backgroundForGenre = (value: string): string | null => {
    const lower = value.toLowerCase();
    if (lower.includes("trap")) return "/img/trap.png";
    if (lower.includes("r&b") || lower.includes("rnb")) return "/img/rnb.png";
    if (lower.includes("new wave")) return "/img/newwave.png";
    if (lower.includes("melanc")) return "/img/melancolique.png";
    return null;
  };

  const background = backgroundForGenre(genre);

  const handleAdd = () => {
    addItem({ id, name, price });
    onAdd?.();
  };

  const handleFav = async () => {
    const next = !fav;
    setFav(next);
    try {
      if (onFav) {
        await onFav();
      } else if (user) {
        await toggleFavorite(String(id));
      } else {
        setFav(!next);
        return;
      }
    } catch {
      setFav(!next);
      alert("Impossible de mettre à jour les favoris");
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-xl"
      data-testid="beat-card"
    >
      {background ? (
        <img
          src={background}
          alt=""
          className="absolute inset-0 h-full w-full object-cover blur-[2px] brightness-[.75]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#141416] to-[#0b0b12]" />
      )}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-end">
          <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">
            {price.toFixed(2)} EUR
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm sm:text-base font-semibold text-white">{name}</h3>
          <div className="truncate text-[11px] sm:text-xs text-zinc-300/90">{artist}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`${chipClass} whitespace-nowrap`}>
              <Music2 className="h-3 w-3" />
              {genre}
            </span>
            <span className={`${chipClass} whitespace-nowrap`}>{bpm} BPM</span>
            <span className={`${chipClass} whitespace-nowrap`}>{keySig}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <ActionBar
              size="sm"
              isCurrent={isCurrent}
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onAdd={handleAdd}
              onFav={handleFav}
              isFav={fav}
              onMore={onMore}
            />
            {tag && showTag && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[0.6rem] sm:text-[0.68rem] text-zinc-200">
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
