"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Beat } from "@/lib/catalog";

/**
 * Un seul lecteur pour tout le site : la prod continue quand on change de page,
 * la file suit la liste d'où l'on a lancé l'écoute, la suivante démarre seule.
 */
type AudioCtx = {
  track: Beat | null;
  queue: Beat[];
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  play: (beat: Beat, queue?: Beat[]) => void;
  toggle: (beat?: Beat, queue?: Beat[]) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  close: () => void;
};

const Ctx = createContext<AudioCtx | null>(null);
const VOLUME_KEY = "bmz-volume";

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<Beat | null>(null);
  const [queue, setQueue] = useState<Beat[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const queueRef = useRef<Beat[]>([]);
  const trackRef = useRef<Beat | null>(null);
  queueRef.current = queue;
  trackRef.current = track;

  const audio = useCallback(() => {
    if (!audioRef.current && typeof window !== "undefined") {
      const a = new Audio();
      a.preload = "metadata";
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  const load = useCallback(
    (beat: Beat) => {
      const a = audio();
      if (!a) return;
      if (!beat.previewUrl) {
        setTrack(beat);
        setError("Pas d’extrait pour cette prod.");
        setIsPlaying(false);
        return;
      }
      setError(null);
      setTrack(beat);
      setCurrentTime(0);
      setDuration(beat.previewSeconds ?? 0);
      a.src = beat.previewUrl;
      setIsLoading(true);
      a.play().catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
      });
    },
    [audio],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      const list = queueRef.current;
      const cur = trackRef.current;
      if (!cur || list.length === 0) return;
      const i = list.findIndex((b) => b.id === cur.id);
      const nextBeat = list[i + dir];
      if (nextBeat) load(nextBeat);
      else if (dir === 1) {
        setIsPlaying(false);
        audio()?.pause();
      }
    },
    [audio, load],
  );

  // Écoute de l'élément audio (une fois).
  useEffect(() => {
    const a = audio();
    if (!a) return;
    try {
      const saved = Number(window.localStorage.getItem(VOLUME_KEY));
      if (Number.isFinite(saved) && saved >= 0 && saved <= 1 && window.localStorage.getItem(VOLUME_KEY) !== null) {
        a.volume = saved;
        setVolumeState(saved);
      } else a.volume = 0.8;
    } catch {
      a.volume = 0.8;
    }
    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => Number.isFinite(a.duration) && setDuration(a.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onPlaying = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onEnded = () => step(1);
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      if (a.src) setError("L’extrait ne se lance pas. Réessaie dans un instant.");
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
    };
  }, [audio, step]);

  const play = useCallback(
    (beat: Beat, q?: Beat[]) => {
      if (q) setQueue(q);
      const a = audio();
      if (trackRef.current?.id === beat.id && a?.src) {
        void a.play().catch(() => undefined);
        return;
      }
      load(beat);
    },
    [audio, load],
  );

  const pause = useCallback(() => audio()?.pause(), [audio]);

  const toggle = useCallback(
    (beat?: Beat, q?: Beat[]) => {
      const a = audio();
      if (beat && trackRef.current?.id !== beat.id) return play(beat, q);
      if (!a || !trackRef.current) return;
      if (a.paused) void a.play().catch(() => undefined);
      else a.pause();
    },
    [audio, play],
  );

  const seek = useCallback(
    (seconds: number) => {
      const a = audio();
      if (!a || !Number.isFinite(seconds)) return;
      a.currentTime = Math.max(0, Math.min(seconds, a.duration || seconds));
      setCurrentTime(a.currentTime);
    },
    [audio],
  );

  const setVolume = useCallback(
    (v: number) => {
      const a = audio();
      const clamped = Math.max(0, Math.min(1, v));
      if (a) a.volume = clamped;
      setVolumeState(clamped);
      try {
        window.localStorage.setItem(VOLUME_KEY, String(clamped));
      } catch {
        /* réglage non gardé : sans conséquence */
      }
    },
    [audio],
  );

  const close = useCallback(() => {
    const a = audio();
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load();
    }
    setTrack(null);
    setIsPlaying(false);
    setError(null);
  }, [audio]);

  // Barre d'espace : lecture / pause, hors des champs de saisie.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || !trackRef.current) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(t.tagName))) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const value = useMemo<AudioCtx>(
    () => ({
      track,
      queue,
      isPlaying,
      isLoading,
      error,
      currentTime,
      duration,
      volume,
      play,
      toggle,
      pause,
      next: () => step(1),
      prev: () => {
        const a = audio();
        if (a && a.currentTime > 3) seek(0);
        else step(-1);
      },
      seek,
      setVolume,
      close,
    }),
    [track, queue, isPlaying, isLoading, error, currentTime, duration, volume, play, toggle, pause, step, audio, seek, setVolume, close],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio doit être utilisé dans AudioPlayerProvider");
  return ctx;
}
