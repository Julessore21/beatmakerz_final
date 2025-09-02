"use client";

import ActionBar from "./ActionBar";
import { Crown, Flame, Star } from "lucide-react";

export type BeatRowProps = {
  id: number;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  keySig: string; // Gamme
  price?: number;
  tagIcon?: "top" | "new" | "popular" | null;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlayPause: () => void;
  onAdd?: () => void;
  onFav?: () => void;
  onMore?: () => void;
};

export default function BeatTableRow(p: BeatRowProps) {
  return (
    <tr className="hover:bg-white/5">
      <td className="px-4 py-3 font-medium">{p.name}</td>
      <td className="px-4 py-3 text-center">{p.genre}</td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white">
          {p.bpm}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white">
          {p.keySig}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        {typeof p.price === "number" ? (
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white">
            {p.price.toFixed(2)}€
          </span>
        ) : (
          <span className="inline-block h-5 w-[60px]" />
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex h-4 w-4 items-center justify-center">
          {p.tagIcon === "top" && <Flame className="h-4 w-4 text-orange-400" />}
          {p.tagIcon === "new" && <Star className="h-4 w-4 text-yellow-300" />}
          {p.tagIcon === "popular" && <Crown className="h-4 w-4 text-amber-300" />}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="inline-flex items-center gap-2 justify-center">
          <ActionBar
            size="xs"
            isCurrent={p.isCurrent}
            isPlaying={p.isPlaying}
            onPlayPause={p.onPlayPause}
            onAdd={p.onAdd}
            onFav={p.onFav}
            onMore={p.onMore}
          />
        </div>
      </td>
    </tr>
  );
}
