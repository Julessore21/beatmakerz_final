/* eslint-disable @next/next/no-img-element */
import { coverGradient } from "@/lib/cover";
import { cn } from "@/lib/cn";

/** Pochette d'une prod : l'image si elle existe, sinon un dégradé de la famille du logo (jamais une fausse image). */
export function Cover({ id, url, title, className }: { id: string; url: string | null; title: string; className?: string }) {
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-lg bg-ink-700", className)} style={url ? undefined : { background: coverGradient(id) }}>
      {url ? (
        <img src={url} alt={`Pochette de ${title}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : (
        <svg viewBox="0 0 40 40" className="absolute inset-0 m-auto h-1/3 w-1/3 opacity-40" aria-hidden="true">
          {[11, 20, 29].map((x) => (
            <rect key={x} x={x - 2.4} y="9" width="4.8" height="22" rx="2.4" fill="#fff" />
          ))}
        </svg>
      )}
    </div>
  );
}
