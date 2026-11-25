import { cn } from "@/lib/cn";
import { BeatCover } from "./BeatCover";

/** Pochette carrée d'une prod (listes, panier, lecteur, fiche) : celle de son style, ou son image. */
export function Cover({ id, url, title, genres, bpm, keyName, className }: { id: string; url: string | null; title: string; genres?: string[]; bpm?: number | null; keyName?: string | null; className?: string }) {
  return <BeatCover id={id} url={url} title={title} genres={genres} bpm={bpm} keyName={keyName} className={cn("aspect-square rounded-lg", className)} />;
}
