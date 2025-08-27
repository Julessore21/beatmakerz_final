import { useEffect, useRef, useState, useCallback } from "react";

export type Beat = {
  id?: number | string;
  name?: string;
  audio: string; // URL du fichier audio
};

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [beat, setBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Crée l'instance Audio côté client uniquement
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = "metadata";
      audioRef.current = a;
    }
    const a = audioRef.current!;

    const onEnded = () => setIsPlaying(false);
    a.addEventListener("ended", onEnded);

    return () => {
      a.pause();
      a.removeEventListener("ended", onEnded);
      // Ne pas remettre a.src = "" pour garder le cache si retour
    };
  }, []);

  const playBeat = useCallback(
    async (newBeat: Beat) => {
      const a = audioRef.current;
      if (!a) return;

      // Si on change de morceau
      if (beat?.audio !== newBeat.audio) {
        try {
          a.pause();
          a.src = newBeat.audio;
          await a.play();
          setBeat(newBeat);
          setIsPlaying(true);
        } catch {
          // play() peut être bloqué par l'autoplay policy
          setIsPlaying(false);
        }
        return;
      }

      // Même morceau -> toggle
      if (a.paused) {
        try {
          await a.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      } else {
        a.pause();
        setIsPlaying(false);
      }
    },
    [beat?.audio]
  );

  const togglePlay = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;

    if (a.paused) {
      try {
        await a.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      a.pause();
      setIsPlaying(false);
    }
  }, []);

  return { beat, isPlaying, playBeat, togglePlay };
};
