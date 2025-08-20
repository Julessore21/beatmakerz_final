"use client";

import { motion } from "framer-motion";
import { Play, Pause, Plus, Heart, MoreVertical } from "lucide-react";

type Size = "xs" | "sm" | "md";

/** Boutons d'action minimalistes (icônes seules) */
export type ActionBarProps = {
  isCurrent?: boolean;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onAdd?: () => void;
  onFav?: () => void;
  onMore?: () => void;
  /** xs pour les lignes de tableau, sm (défaut) pour les cards, md si tu veux un peu plus grand */
  size?: Size;
};

const sizeClasses: Record<Size, string> = {
  xs: "h-8 w-8", // 2rem
  sm: "h-9 w-9", // 2.25rem
  md: "h-10 w-10", // 2.5rem
};

const iconSize: Record<Size, number> = {
  xs: 14,
  sm: 16,
  md: 18,
};

const ghostBtn =
  "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 " +
  "hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors";

export default function ActionBar({
  isCurrent,
  isPlaying,
  onPlayPause,
  onAdd,
  onFav,
  onMore,
  size = "sm",
}: ActionBarProps) {
  const playing = !!isCurrent && !!isPlaying;
  const cls = `${ghostBtn} ${sizeClasses[size]}`;
  const i = iconSize[size];

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={onPlayPause}
        className={`${cls} ${
          playing ? "bg-indigo-600 border-indigo-600 hover:bg-indigo-500" : ""
        }`}
        aria-label={playing ? "Pause" : "Lecture"}
        title={playing ? "Pause" : "Lecture"}
      >
        {playing ? <Pause size={i} /> : <Play size={i} />}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={onAdd}
        className={cls}
        aria-label="Ajouter au panier"
        title="Ajouter au panier"
      >
        <Plus size={i} />
      </motion.button>

      <button
        onClick={onFav}
        className={cls}
        aria-label="Ajouter aux favoris"
        title="Ajouter aux favoris"
      >
        <Heart size={i} />
      </button>

      <button
        onClick={onMore}
        className={cls}
        aria-label="Plus d'options"
        title="Plus d'options"
      >
        <MoreVertical size={i} />
      </button>
    </div>
  );
}
