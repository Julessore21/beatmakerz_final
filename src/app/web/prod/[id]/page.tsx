import type { Metadata } from "next";
import { fetchBeat, type Beat } from "@/lib/catalog";
import { BeatView } from "./BeatView";

/** Lue côté serveur pour l'aperçu du lien (TikTok, Instagram, messages) ; la page se recharge seule si l'API dort. */
async function load(id: string): Promise<Beat | null> {
  try {
    return await fetchBeat(id, { signal: AbortSignal.timeout(4000), cache: "no-store" });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const beat = await load(id);
  if (!beat) return { title: "Prod", alternates: { canonical: `/web/prod/${id}` } };
  const meta = [beat.genres[0], beat.bpm ? `${beat.bpm} BPM` : null, beat.key].filter(Boolean).join(" · ");
  const description = `${beat.title}${meta ? ` (${meta})` : ""} : écoute l’extrait et achète la licence sur Beatmakerz.`;
  return {
    title: beat.title,
    description,
    alternates: { canonical: `/web/prod/${id}` },
    openGraph: { title: `${beat.title} · Beatmakerz`, description, type: "music.song", url: `/web/prod/${id}`, ...(beat.coverUrl ? { images: [{ url: beat.coverUrl }] } : {}) },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beat = await load(id);
  return <BeatView id={id} initial={beat} />;
}
