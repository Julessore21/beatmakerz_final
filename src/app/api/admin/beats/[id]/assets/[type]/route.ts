import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * POST /api/admin/beats/[id]/assets/[type] - Upload asset (preview, mp3, wav, stems)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  const { id, type } = await params;
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

    // Upload vers le backend qui uploadera vers FileUp
    const response = await fetch(`${API_URL}/beats/${id}/assets/${type}`, {
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
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error uploading asset:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload asset" },
      { status: 500 }
    );
  }
}
