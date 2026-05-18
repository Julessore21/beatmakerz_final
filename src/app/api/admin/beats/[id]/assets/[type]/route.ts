import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/utils/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * POST /api/admin/beats/[id]/assets/[type] - Upload beat audio asset
 * Types: preview, mp3, wav, stems, project
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  const { id, type } = await params;

  // Récupérer le token depuis les cookies OU depuis le header Authorization
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("accessToken")?.value;
  const authHeader = request.headers.get("Authorization");
  const headerToken = authHeader?.replace("Bearer ", "");

  const accessToken = cookieToken || headerToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Valider le type d'asset
  const validTypes = ["preview", "mp3", "wav", "stems", "project"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `Invalid asset type. Must be one of: ${validTypes.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    // Récupérer le fichier du FormData
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Créer un nouveau FormData pour l'envoyer au backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    // Optionnel: ajouter la durée si fournie
    const durationSec = formData.get("durationSec");
    if (durationSec) {
      backendFormData.append("durationSec", durationSec.toString());
    }

    // Appel au backend
    const response = await fetch(`${API_URL}/beats/${id}/assets/${type}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(`Error uploading ${type} asset:`, error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
