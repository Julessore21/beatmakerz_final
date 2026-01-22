import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/server-auth";
import { BeatDocument } from "@/types/models";

type RouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

const getRouteParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const sanitizeBeat = (doc: any): BeatDocument => ({
  _id: doc._id?.toString?.() ?? doc._id,
  artistId: doc.artistId,
  title: doc.title,
  bpm: doc.bpm,
  key: doc.key,
  genres: doc.genres ?? [],
  moods: doc.moods ?? [],
  status: doc.status,
  visibility: doc.visibility,
  coverUrl: doc.coverUrl,
  previewUrl: doc.previewUrl,
  audioUrl: doc.audioUrl,
  audioFormat: doc.audioFormat,
  duration: doc.duration,
  fileSize: doc.fileSize,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

type BeatFromDb = {
  status?: BeatDocument["status"];
  visibility?: BeatDocument["visibility"];
  previewUrl?: string;
  audioUrl?: string;
};

const validateUpdate = (
  existing: BeatFromDb,
  payload: Partial<BeatDocument>
): string | null => {
  const status = payload.status ?? existing.status;
  const visibility = payload.visibility ?? existing.visibility;
  const previewUrl = payload.previewUrl ?? existing.previewUrl;
  const audioUrl = payload.audioUrl ?? existing.audioUrl;

  if (status === "published" && !previewUrl) {
    return "Un preview est requis pour publier.";
  }
  if (status === "published" && visibility === "public" && !audioUrl) {
    return "Le beat vendable doit contenir la version complète (audioUrl).";
  }
  return null;
};

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const authResponse = requireAdmin(req);
  if (authResponse) return authResponse;

  const params = await ctx.params;
  const beatId = getRouteParam(params["beatId"]);
  if (!beatId) {
    return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
  }

  const id = new ObjectId(beatId);
  const db = await getDatabase();
  const collection = db.collection("beats");
  const existing = await collection.findOne({ _id: id });
  if (!existing) {
    return NextResponse.json({ error: "Beat introuvable" }, { status: 404 });
  }

  const payload = (await req.json()) as Partial<BeatDocument>;
  const validationError = validateUpdate(existing as unknown as BeatFromDb, payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const updates: Partial<BeatDocument> = {
    ...payload,
    genres: payload.genres ?? existing.genres ?? [],
    moods: payload.moods ?? existing.moods ?? [],
    updatedAt: new Date(),
  };

  if (payload.title) {
    updates.title = payload.title.trim();
  }

  if (payload.key) {
    updates.key = payload.key.trim();
  }

  await collection.updateOne({ _id: id }, { $set: updates });
  const updated = await collection.findOne({ _id: id });
  return NextResponse.json(updated ? sanitizeBeat(updated) : null);
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const authResponse = requireAdmin(req);
  if (authResponse) return authResponse;

  const params = await ctx.params;
  const beatId = getRouteParam(params["beatId"]);
  if (!beatId) {
    return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
  }

  const id = new ObjectId(beatId);
  const db = await getDatabase();
  const result = await db.collection("beats").deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Beat introuvable" }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}
