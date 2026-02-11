import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * POST /api/admin/beats/[id]/audio - Upload beat audio (génère automatiquement preview + full track)
 *
 * Cette route upload UN SEUL fichier audio et le backend génère automatiquement:
 * - Une preview de 45 secondes (début du track)
 * - Le fichier complet
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Récupérer le token depuis les cookies OU depuis le header Authorization
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("accessToken")?.value;
  const authHeader = request.headers.get("Authorization");
  const headerToken = authHeader?.replace("Bearer ", "");

  const accessToken = cookieToken || headerToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Récupérer le fichier du FormData
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Vérifier que c'est bien un fichier audio
    if (!file.type.includes("audio")) {
      return NextResponse.json(
        { error: "File must be an audio file (MP3, WAV, etc.)" },
        { status: 400 }
      );
    }

    // Créer un nouveau FormData pour l'envoyer au backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);
    backendFormData.append("generatePreview", "true"); // Flag pour générer la preview automatiquement

    console.log(`[API /admin/beats/${id}/audio] Uploading audio file:`, file.name, `(${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // Appel au backend pour upload avec génération de preview
    // Note: Le backend doit avoir un endpoint qui supporte generatePreview=true
    const response = await fetch(`${API_URL}/beats/${id}/upload-audio`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      console.error(`[API /admin/beats/${id}/audio] Backend error:`, error);
      throw new Error(error.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API /admin/beats/${id}/audio] Success:`, data);

    // Le backend devrait retourner les deux assets créés: preview et mp3
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Error uploading audio:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to upload audio" },
      { status: 500 }
    );
  }
}
