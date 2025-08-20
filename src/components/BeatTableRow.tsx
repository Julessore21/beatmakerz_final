"use client";

import ActionBar from "./ActionBar";

export type BeatRowProps = {
  id: number;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  keySig: string;
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
      <td className="px-4 py-3 text-zinc-300">{p.artist}</td>
      <td className="px-4 py-3">{p.genre}</td>
      <td className="px-4 py-3 text-center">{p.bpm}</td>
      <td className="px-4 py-3 text-center">{p.keySig}</td>
      <td className="px-4 py-3">
        <ActionBar
          size="xs"
          isCurrent={p.isCurrent}
          isPlaying={p.isPlaying}
          onPlayPause={p.onPlayPause}
          onAdd={p.onAdd}
          onFav={p.onFav}
          onMore={p.onMore}
        />
      </td>
    </tr>
  );
}
