import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export type PublicBeat = {
  _id: string;
  title: string;
  bpm?: number;
  key?: string;
  previewUrl?: string;
  coverUrl?: string;
  genres?: string[];
  moods?: string[];
};

export async function GET() {
  const db = await getDatabase();
  const beats = await db
    .collection("beats")
    .find({ status: "published", visibility: "public" })
    .project({
      audioUrl: 0,
      artistId: 0,
    })
    .sort({ updatedAt: -1 })
    .toArray();

  const mapped = beats.map((beat) => ({
    _id: beat._id?.toString?.() ?? beat._id,
    title: beat.title,
    bpm: beat.bpm,
    key: beat.key,
    previewUrl: beat.previewUrl,
    coverUrl: beat.coverUrl,
    genres: beat.genres ?? [],
    moods: beat.moods ?? [],
  }));

  return NextResponse.json(mapped);
}
