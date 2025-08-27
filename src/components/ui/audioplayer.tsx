import * as React from "react";

type Beat = { id?: number | string; name?: string; audio?: string } | null;

const AudioPlayer: React.FC<{
  beat: Beat;
  isPlaying: boolean;
  togglePlay: () => void;
}> = ({ beat, isPlaying, togglePlay }) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-sm">
        <div className="truncate">
          <span className="font-semibold">{beat?.name ?? "Aucun titre"}</span>
        </div>
        <button
          onClick={togglePlay}
          className="rounded-full border border-white/10 px-4 py-1.5 hover:bg-white/10"
        >
          {isPlaying ? "Pause" : "Lecture"}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
