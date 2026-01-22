import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/server-auth";
import { BeatDocument } from "@/types/models";

const DEFAULT_STATUS: BeatDocument["status"] = "draft";
const DEFAULT_VISIBILITY: BeatDocument["visibility"] = "public";

type BeatRecord = Omit<BeatDocument, "_id"> & { _id?: ObjectId };
type BeatPayload = Partial<Omit<BeatDocument, "_id">>;

const validateBeatPayload = (payload: BeatPayload) => {
  if (!payload.title?.trim()) {
    return "Le titre est obligatoire.";
  }
  const status = payload.status || DEFAULT_STATUS;
  const visibility = payload.visibility || DEFAULT_VISIBILITY;
  if (status === "published" && !payload.previewUrl) {
    return "Un preview est requis pour publier.";
  }
  if (status === "published" && visibility === "public" && !payload.audioUrl) {
    return "Le beat vendable doit contenir la version complète (audioUrl).";
  }
  return null;
};

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

export async function GET() {
  const db = await getDatabase();
  const beats = await db
    .collection<BeatRecord>("beats")
    .find()
    .sort({ updatedAt: -1 })
    .toArray();
  const sanitized = beats.map(sanitizeBeat);
  return NextResponse.json(sanitized);
}

export async function POST(req: NextRequest) {
  const authResponse = requireAdmin(req);
  if (authResponse) return authResponse;

  const payload = (await req.json()) as BeatPayload;
  const validationError = validateBeatPayload(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const now = new Date();
  const doc: BeatRecord = {
    ...payload,
    title: payload.title!.trim(),
    bpm: payload.bpm,
    key: payload.key?.trim(),
    genres: payload.genres ?? [],
    moods: payload.moods ?? [],
    status: payload.status ?? DEFAULT_STATUS,
    visibility: payload.visibility ?? DEFAULT_VISIBILITY,
    previewUrl: payload.previewUrl,
    coverUrl: payload.coverUrl,
    audioUrl: payload.audioUrl,
    audioFormat: payload.audioFormat,
    duration: payload.duration,
    fileSize: payload.fileSize,
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDatabase();
  const result = await db.collection<BeatRecord>("beats").insertOne(doc);
  if (result.insertedId) {
    return NextResponse.json({ id: result.insertedId.toString() });
  }

  return NextResponse.json({ error: "Impossible de créer le beat." }, { status: 500 });
}
