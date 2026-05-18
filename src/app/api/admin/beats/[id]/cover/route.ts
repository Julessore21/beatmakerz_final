import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/utils/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * POST /api/admin/beats/[id]/cover - Upload beat cover image
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
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Créer un nouveau FormData pour l'envoyer au backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    // Appel au backend
    const response = await fetch(`${API_URL}/beats/${id}/cover`, {
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
    console.error("Error uploading cover:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
