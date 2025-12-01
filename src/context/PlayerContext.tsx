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

/** Doit matcher les champs utilisés dans page.tsx / GlobalPlayer.tsx */
export type Beat = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  tag: string | null;
  audio: string; // URL audio publique
};

type PlayerContextValue = {
  // état
  current: Beat | null;
  isPlaying: boolean;
  queue: Beat[];
  volume: number; // 0..1
  duration: number; // s
  currentTime: number; // s
  progress: number; // 0..1

  // actions
  play: (beat: Beat, queue?: Beat[]) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void; // 0..1
  setVolume: (v: number) => void; // 0..1
  setQueue: (q: Beat[]) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // element Audio unique, créé côté client seulement
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    if (typeof window === "undefined") return null;
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;
    return a;
  }, []);

  // état principal
  const [current, setCurrent] = useState<Beat | null>(null);
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

  // listeners de l'audio
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
      // auto-next si possible
      setTimeout(() => {
        setProgress(0);
        if (!current) return;
        const idx = queue.findIndex((b) => b.id === current.id);
        if (idx >= 0 && idx < queue.length - 1) {
          const nxt = queue[idx + 1];
          play(nxt);
        }
      }, 0);
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
  }, [ensureAudio, current, queue, play]);

  // persister le volume
  useEffect(() => {
    const a = ensureAudio();
    if (!a) return;
    a.volume = volume;
    if (typeof window !== "undefined") {
      localStorage.setItem("bm_volume", String(volume));
    }
  }, [volume, ensureAudio]);

  // actions
  const play = useCallback(
    (beat: Beat, newQueue?: Beat[]) => {
      const a = ensureAudio();
      if (!a) return;
      if (newQueue) setQueue(newQueue);
      if (!current || current.id !== beat.id) {
        a.src = beat.audio;
        setCurrent(beat);
      }
      a.play().catch(() => void 0);
      setIsPlaying(true);
    },
    [current, ensureAudio]
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
    if (!current) return;
    const idx = queue.findIndex((b) => b.id === current.id);
    if (idx >= 0 && idx < queue.length - 1) {
      play(queue[idx + 1]);
    }
  }, [current, queue, play]);

  const prev = useCallback(() => {
    if (!current) return;
    const idx = queue.findIndex((b) => b.id === current.id);
    if (idx > 0) {
      play(queue[idx - 1]);
    }
  }, [current, queue, play]);

  const seek = useCallback(
    (ratio: number) => {
      const a = ensureAudio();
      if (!a || !duration) return;
      const clamped = Math.max(0, Math.min(1, ratio));
      a.currentTime = clamped * duration;
      // progress et currentTime seront mis à jour par timeupdate
    },
    [duration, ensureAudio]
  );

  const value: PlayerContextValue = useMemo(
    () => ({
      current,
      isPlaying,
      queue,
      volume,
      duration,
      currentTime,
      progress,
      play,
      pause,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      setQueue,
    }),
    [
      current,
      isPlaying,
      queue,
      volume,
      duration,
      currentTime,
      progress,
      play,
      pause,
      toggle,
      next,
      prev,
      seek,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within <PlayerProvider>");
  return ctx;
};
