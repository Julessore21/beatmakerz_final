/* eslint-disable @next/next/no-img-element */
import type { Beat } from "@/lib/catalog";
import { coverGradient } from "@/lib/cover";
import { cn } from "@/lib/cn";

/**
 * Grande pochette d'une prod : son image si elle en a une, sinon une couverture typographique
 * composée de ses vraies données (titre, tempo, tonalité, genre). Rien d'inventé.
 */
export function ArtCover({ beat, index, className, playing }: { beat: Beat; index?: number; className?: string; playing?: boolean }) {
  const meta = [beat.key, beat.genres[0]].filter(Boolean).join(" · ");
  return (
    <div className={cn("relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-white/10", className)} style={{ background: coverGradient(beat.id) }}>
      {beat.coverUrl ? (
        <img src={beat.coverUrl} alt={`Pochette de ${beat.title}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
      ) : (
        // Grain léger : la couverture a de la matière sans rien inventer.
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.18] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:3px_3px]" />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 sm:p-7">
        <span>Beatmakerz{index != null ? ` — N°${String(index + 1).padStart(2, "0")}` : ""}</span>
        <span>{beat.bpm ? `${beat.bpm} BPM` : ""}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        {playing && (
          <span className="mb-4 flex h-6 items-end gap-[3px]" aria-hidden="true">
            {[0, 0.15, 0.3, 0.45, 0.6].map((d) => (
              <span key={d} className="h-full w-1 origin-bottom animate-bars rounded-full bg-white" style={{ animationDelay: `${d}s` }} />
            ))}
          </span>
        )}
        <p className="text-[clamp(40px,6.4vw,96px)] font-semibold uppercase leading-[0.86] tracking-[-0.05em] text-white [overflow-wrap:anywhere]">{beat.title}</p>
        {meta && <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/75">{meta}</p>}
      </div>
    </div>
  );
}
