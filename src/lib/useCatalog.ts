"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAllBeats, type Beat } from "@/lib/catalog";

/** Le catalogue, chargé une fois pour tout le site (accueil, catalogue, fiche), rechargé à la demande. */
let cache: Promise<Beat[]> | null = null;

export function useCatalog() {
  const [beats, setBeats] = useState<Beat[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((fresh = false) => {
    if (fresh || !cache) cache = fetchAllBeats();
    setError(null);
    const p = cache;
    p.then((list) => cache === p && setBeats(list)).catch(() => {
      if (cache === p) cache = null;
      setError("Le catalogue ne répond pas pour le moment.");
    });
  }, []);

  useEffect(() => load(), [load]);

  return { beats, error, retry: () => load(true), loading: beats === null && !error };
}
