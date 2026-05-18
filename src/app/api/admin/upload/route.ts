import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/utils/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * POST /api/admin/upload - Upload fichier vers FileUp via backend
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Créer un nouveau FormData pour envoyer au backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    // Appel au backend pour uploader vers FileUp
    const response = await fetch(`${API_URL}/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Upload failed: ${response.status}`);
    }

    const data = await response.json();

    // Le backend retourne { downloadLink, filename, size, mimetype }
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
