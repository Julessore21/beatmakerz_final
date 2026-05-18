"use client";
/* eslint-disable @next/next/no-img-element */

import { memo } from "react";
import { motion } from "framer-motion";
import { Music2, Flame, Star, Crown } from "lucide-react";
import ActionBar from "./ActionBar";
import { useCart } from "@/context/CartContext";
import { toggleFavorite } from "@/lib/services/user-api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getBeatCover } from "@/lib/genre-cover";

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
  coverUrl?: string | null;
};

const chipClass =
  "inline-flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] sm:text-[11px] text-zinc-200 max-w-[80px] sm:max-w-[90px] whitespace-nowrap overflow-hidden text-ellipsis";

function BeatCard({
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
  coverUrl,
}: BeatCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [fav, setFav] = useState<boolean>(isFav);

  useEffect(() => setFav(isFav), [isFav]);

  const background = getBeatCover(coverUrl, [genre]);

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

      <div className="relative flex h-full flex-col justify-between p-3 xs:p-4 sm:p-5">
        <div className="flex items-start justify-end">
          <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">
            {price.toFixed(2)} EUR
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm sm:text-base font-semibold text-white">{name}</h3>
          <div className="truncate text-[11px] sm:text-xs text-zinc-300/90">{artist}</div>
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className={`${chipClass} whitespace-nowrap`}>
              <Music2 className="h-3 w-3" />
              {genre}
            </span>
            <span className={`${chipClass} whitespace-nowrap`}>{bpm} BPM</span>
            <span className={`${chipClass} whitespace-nowrap`}>{keySig}</span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 sm:gap-3">
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
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80"
                title={tag}
              >
                {tag === "Tendance" && <Flame className="h-4 w-4 text-orange-400" />}
                {tag === "Nouveau" && <Star className="h-4 w-4 text-yellow-300" />}
                {tag === "Populaire" && <Crown className="h-4 w-4 text-amber-300" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(BeatCard, (prev, next) =>
  prev.id === next.id &&
  prev.name === next.name &&
  prev.artist === next.artist &&
  prev.genre === next.genre &&
  prev.bpm === next.bpm &&
  prev.keySig === next.keySig &&
  prev.price === next.price &&
  prev.tag === next.tag &&
  prev.isCurrent === next.isCurrent &&
  prev.isPlaying === next.isPlaying &&
  prev.isFav === next.isFav &&
  prev.coverUrl === next.coverUrl &&
  prev.showTag === next.showTag
);
