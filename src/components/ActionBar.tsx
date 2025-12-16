"use client";

import { motion } from "framer-motion";
import { Play, Pause, Plus, Heart, MoreVertical } from "lucide-react";

type Size = "xs" | "sm" | "md";

export type ActionBarProps = {
  isCurrent?: boolean;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onAdd?: () => void;
  onFav?: () => void;
  onMore?: () => void;
  size?: Size;
  isFav?: boolean;
};

const sizeClasses: Record<Size, string> = {
  xs: "h-8 w-8",
  sm: "h-9 w-9",
  md: "h-10 w-10",
};

const iconSize: Record<Size, number> = {
  xs: 14,
  sm: 16,
  md: 18,
};

const baseButtonClass =
  "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition-colors " +
  "hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20";

export default function ActionBar({
  isCurrent,
  isPlaying,
  onPlayPause,
  onAdd,
  onFav,
  onMore,
  size = "sm",
  isFav = false,
}: ActionBarProps) {
  const playing = Boolean(isCurrent && isPlaying);
  const className = `${baseButtonClass} ${sizeClasses[size]}`;
  const icon = iconSize[size];

  return (
    <div className="flex items-center gap-2">
      <motion.button
        data-testid="action-play"
        whileTap={{ scale: 0.94 }}
        onClick={onPlayPause}
        className={`${className} ${playing ? "bg-indigo-600 border-indigo-600 hover:bg-indigo-500" : ""}`}
        aria-label={playing ? "Mettre en pause" : "Lecture"}
        title={playing ? "Mettre en pause" : "Lecture"}
      >
        {playing ? <Pause size={icon} /> : <Play size={icon} />}
      </motion.button>

      <motion.button
        data-testid="action-add-to-cart"
        whileTap={{ scale: 0.94 }}
        onClick={onAdd}
        className={className}
        aria-label="Ajouter"
        title="Ajouter"
      >
        <Plus size={icon} />
      </motion.button>

      <button
        data-testid="action-favorite"
        onClick={onFav}
        className={className}
        aria-label="Ajouter aux favoris"
        title="Ajouter aux favoris"
      >
        <Heart size={icon} className={isFav ? "text-rose-400" : ""} fill={isFav ? "currentColor" : "none"} />
      </button>

      {onMore ? (
        <button
          onClick={onMore}
          className={className}
          aria-label="Plus d'options"
          title="Plus d'options"
        >
          <MoreVertical size={icon} />
        </button>
      ) : null}
    </div>
  );
}
