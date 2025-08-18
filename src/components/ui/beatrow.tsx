import * as React from "react";

type Beat = {
  id: number | string;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  tag?: string | null;
  audio?: string;
};

type Props = {
  beat: Beat;
  index: number;
  onPlay: (b: Beat) => void;
  isPlaying: boolean;
  current?: Beat | null;
};

const BeatRow: React.FC<Props> = ({
  beat,
  index,
  onPlay,
  isPlaying,
  current,
}) => {
  const isCurrent = current?.id === beat.id;

  return (
    <tr className="border-b border-white/10 hover:bg-white/5">
      <td className="px-4 py-3 text-sm">{index + 1}</td>
      <td className="px-2 py-3 text-sm">
        <button
          onClick={() => onPlay(beat)}
          className="mr-2 rounded-full border border-white/10 px-2 py-0.5 text-[11px] hover:bg-white/10"
        >
          {isCurrent && isPlaying ? "Pause" : "Play"}
        </button>
        {beat.name}
      </td>
      <td className="px-2 py-3 text-sm">{beat.artist}</td>
      <td className="px-2 py-3 text-sm">{beat.genre}</td>
      <td className="px-2 py-3 text-sm">{beat.bpm}</td>
      <td className="px-2 py-3 text-sm">{beat.key}</td>
    </tr>
  );
};

export default BeatRow;
