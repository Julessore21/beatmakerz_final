"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";

export default function GlobalPlayer() {
  const { current, isPlaying, pause, play } = usePlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioRef.current || !current) return;
    audioRef.current.src = current.audio;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [current, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  if (!current) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur shadow-[0_-10px_30px_rgba(0,0,0,0.8)] p-4 flex items-center justify-between z-50"
    >
      <div>
        <p className="font-bold">{current.title}</p>
        <p className="text-sm text-gray-400">{current.artist}</p>
      </div>

      <div className="flex items-center gap-4">
        {isPlaying ? (
          <button
            onClick={pause}
            className="px-4 py-2 bg-purple-600 rounded-lg"
          >
            ⏸ Pause
          </button>
        ) : (
          <button
            onClick={() => play(current)}
            className="px-4 py-2 bg-purple-600 rounded-lg"
          >
            ▶ Play
          </button>
        )}
      </div>

      <div className="flex-1 mx-4">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => {
            if (audioRef.current) {
              const pct = Number(e.target.value);
              audioRef.current.currentTime =
                (pct / 100) * audioRef.current.duration;
              setProgress(pct);
            }
          }}
          className="w-full accent-purple-500"
        />
      </div>

      <audio ref={audioRef} />
    </motion.div>
  );
}
