import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { requireUserId } from "@/lib/server-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string; beatId: string } }
) {
  const userId = requireUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const { orderId, beatId } = params;
  if (!orderId || !beatId) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  let orderObjectId: ObjectId;
  let beatObjectId: ObjectId;
  try {
    orderObjectId = new ObjectId(orderId);
    beatObjectId = new ObjectId(beatId);
  } catch {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 400 });
  }

  const db = await getDatabase();
  const order = await db.collection("orders").findOne({ _id: orderObjectId });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  if (order.userId !== userId) {
    return NextResponse.json({ error: "Accès refusé", status: 403 }, { status: 403 });
  }
  if (order.status !== "paid") {
    return NextResponse.json({ error: "Commande non payée", status: 403 }, { status: 403 });
  }

  const item = (order.items || []).find((it: { beatId: string }) => it.beatId === beatId);
  if (!item) {
    return NextResponse.json({ error: "Beat non présent dans la commande" }, { status: 404 });
  }

  const beat = await db.collection("beats").findOne({ _id: beatObjectId });
  if (!beat || !beat.audioUrl) {
    return NextResponse.json({ error: "Audio indisponible" }, { status: 404 });
  }

  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: { downloadGranted: true },
      $inc: { downloadCount: 1 },
    }
  );

  return NextResponse.redirect(beat.audioUrl);
}
