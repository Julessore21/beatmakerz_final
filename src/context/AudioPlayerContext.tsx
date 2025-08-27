"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/** Type commun pour un beat */
export type Beat = {
  id: number;
  name: string; // titre
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  tag: "Tendance" | "Nouveau" | "Populaire" | null;
  audio: string; // URL publique (ex: /audio/test.mp3)
};

type AudioCtxType = {
  track: Beat | null;
  isPlaying: boolean;
  queue: Beat[];
  volume: number; // 0..1
  duration: number; // seconds
  currentTime: number; // seconds
  progress: number; // 0..1

  play: (b: Beat, queue?: Beat[]) => void;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void; // 0..1
  setVolume: (v: number) => void; // 0..1
  setQueue: (q: Beat[]) => void;
};

const AudioCtx = createContext<AudioCtxType | null>(null);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Élément audio unique (client only)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    if (typeof window === "undefined") return null;
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;
    return a;
  }, []);

  // État
  const [track, setTrack] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Beat[]>([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const [volume, setVolume] = useState<number>(() => {
    if (typeof window === "undefined") return 0.8;
    const v = Number(localStorage.getItem("bm_volume"));
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.8;
  });

  // Listeners de l'élément audio
  useEffect(() => {
    const a = ensureAudio();
    if (!a) return;

    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => {
      setCurrentTime(a.currentTime || 0);
      setProgress(a.duration ? a.currentTime / a.duration : 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      // auto next si possible
      if (!track) return;
      const idx = queue.findIndex((q) => q.id === track.id);
      if (idx >= 0 && idx < queue.length - 1) {
        const n = queue[idx + 1];
        play(n);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [ensureAudio, queue, track]);

  // Volume persistant
  useEffect(() => {
    const a = ensureAudio();
    if (!a) return;
    a.volume = volume;
    if (typeof window !== "undefined") {
      localStorage.setItem("bm_volume", String(volume));
    }
  }, [volume, ensureAudio]);

  // Actions principales
  const play = useCallback(
    (b: Beat, q?: Beat[]) => {
      const a = ensureAudio();
      if (!a) return;
      if (q) setQueue(q);
      if (!track || track.id !== b.id) {
        a.src = b.audio;
        setTrack(b);
      }
      a.play().catch(() => void 0);
      setIsPlaying(true);
    },
    [track, ensureAudio]
  );

  const pause = useCallback(() => {
    const a = ensureAudio();
    if (!a) return;
    a.pause();
    setIsPlaying(false);
  }, [ensureAudio]);

  const toggle = useCallback(() => {
    const a = ensureAudio();
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.play().catch(() => void 0);
      setIsPlaying(true);
    }
  }, [isPlaying, ensureAudio]);

  const next = useCallback(() => {
    if (!track) return;
    const idx = queue.findIndex((q) => q.id === track.id);
    if (idx >= 0 && idx < queue.length - 1) {
      play(queue[idx + 1]);
    }
  }, [track, queue, play]);

  const prev = useCallback(() => {
    if (!track) return;
    const idx = queue.findIndex((q) => q.id === track.id);
    if (idx > 0) {
      play(queue[idx - 1]);
    }
  }, [track, queue, play]);

  const seek = useCallback(
    (ratio: number) => {
      const a = ensureAudio();
      if (!a || !duration) return;
      const clamped = Math.max(0, Math.min(1, ratio));
      a.currentTime = clamped * duration;
    },
    [duration, ensureAudio]
  );

  const value = useMemo<AudioCtxType>(
    () => ({
      track,
      isPlaying,
      queue,
      volume,
      duration,
      currentTime,
      progress,
      play,
      toggle,
      pause,
      next,
      prev,
      seek,
      setVolume,
      setQueue,
    }),
    [
      track,
      isPlaying,
      queue,
      volume,
      duration,
      currentTime,
      progress,
      play,
      toggle,
      pause,
      next,
      prev,
      seek,
    ]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
};

export const useAudio = () => {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioPlayerProvider");
  return ctx;
};
