"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { BPM_RANGES, filterBeats, genresOf, type BpmRange, type Sort } from "@/lib/catalog";
import { useCatalog } from "@/lib/useCatalog";
import { cn } from "@/lib/cn";
import { TrackList, TrackListSkeleton } from "@/components/shop/TrackList";

const SORTS: { id: Sort; label: string }[] = [
  { id: "recent", label: "Les plus récentes" },
  { id: "bpm-asc", label: "Tempo croissant" },
  { id: "bpm-desc", label: "Tempo décroissant" },
  { id: "price-asc", label: "Prix croissant" },
];

export function Catalogue() {
  const { beats, error, retry } = useCatalog();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = params.get("q") ?? "";
  const genre = params.get("genre");
  const bpm = (params.get("bpm") as BpmRange | null) ?? "all";
  const sort = (params.get("tri") as Sort | null) ?? "recent";

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all" && value !== "recent") next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const reset = () => router.replace(pathname, { scroll: false });

  const genres = useMemo(() => (beats ? genresOf(beats) : []), [beats]);
  const shown = useMemo(() => (beats ? filterBeats(beats, { query, genre, bpm, sort }) : []), [beats, query, genre, bpm, sort]);
  const filtered = Boolean(query || genre || bpm !== "all");

  return (
    <div className="container-site pt-10 sm:pt-14">
      <h1 className="text-[36px] font-semibold tracking-[-0.03em] sm:text-[44px]">Catalogue</h1>
      <p className="mt-1 text-fg-muted">{beats ? `${beats.length} prod${beats.length > 1 ? "s" : ""}` : "Chargement des prods…"}</p>

      {/* Recherche et filtres, toujours à portée */}
      <div className="sticky top-16 z-30 -mx-5 mt-8 border-b border-line bg-ink/85 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Rechercher une prod</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-faint" />
            <input
              value={query}
              onChange={(e) => set("q", e.target.value || null)}
              placeholder="Titre, genre, ambiance, 140 bpm…"
              className="field pl-11"
              type="search"
              enterKeyHint="search"
            />
          </label>
          <div className="grid grid-cols-2 gap-2 lg:flex">
            <select value={bpm} onChange={(e) => set("bpm", e.target.value)} className="field cursor-pointer lg:w-auto" aria-label="Tempo">
              {BPM_RANGES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id === "all" ? "Tous les tempos" : `${r.label} BPM`}
                </option>
              ))}
            </select>
            <select value={sort} onChange={(e) => set("tri", e.target.value)} className="field cursor-pointer lg:w-auto" aria-label="Trier">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {genres.length > 0 && (
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="group" aria-label="Genres">
            <Chip active={!genre} onClick={() => set("genre", null)}>
              Tous
            </Chip>
            {genres.map((g) => {
              const on = genre?.toLowerCase() === g.toLowerCase();
              return (
                <Chip key={g} active={on} onClick={() => set("genre", on ? null : g)}>
                  {g}
                </Chip>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-6">
        {error ? (
          <div className="card flex flex-col items-center gap-4 px-6 py-14 text-center">
            <p className="font-medium">{error}</p>
            <p className="text-[14px] text-fg-muted">Il se réveille en quelques secondes au premier passage de la journée.</p>
            <button type="button" onClick={retry} className="rounded-full border border-line-strong px-4 py-2 text-[14px] hover:bg-white/[0.06]">
              Réessayer
            </button>
          </div>
        ) : !beats ? (
          <TrackListSkeleton rows={10} />
        ) : shown.length ? (
          <>
            {filtered && (
              <div className="mb-3 flex items-center justify-between text-[14px] text-fg-muted">
                <span>
                  {shown.length} résultat{shown.length > 1 ? "s" : ""}
                </span>
                <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 hover:text-fg">
                  <X className="h-3.5 w-3.5" />
                  Effacer les filtres
                </button>
              </div>
            )}
            <TrackList beats={shown} />
          </>
        ) : (
          <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
            <p className="font-medium">{beats.length ? "Aucune prod ne correspond." : "Les premières prods arrivent très bientôt."}</p>
            {beats.length > 0 && (
              <button type="button" onClick={reset} className="text-[14px] text-fg-muted underline underline-offset-4 hover:text-fg">
                Effacer les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn("h-8 shrink-0 rounded-full border px-3.5 text-[13px] transition-colors", active ? "border-fg bg-fg text-ink" : "border-line text-fg-muted hover:border-line-strong hover:text-fg")}
    >
      {children}
    </button>
  );
}
