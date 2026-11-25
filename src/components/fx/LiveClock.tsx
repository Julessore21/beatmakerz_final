"use client";

import { useEffect, useState } from "react";

/** L'heure de Paris, à la seconde (affichée seulement côté navigateur : pas de décalage au chargement). */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const day = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", year: "numeric" });
    const tick = () => setNow(`${fmt.format(new Date())} — ${day.format(new Date()).replace(/\//g, ".")} · PARIS`);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className={className}>{now ?? " "}</span>;
}
