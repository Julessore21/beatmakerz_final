import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/utils/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * PUT /api/admin/beats/[id] - Mettre à jour un beat
 */
export async function PUT(
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
    const body = await request.json();

    // Ne garder que les champs modifiables
    const payload: Record<string, unknown> = {};
    if (body.title !== undefined) payload.title = body.title;
    if (body.bpm !== undefined) payload.bpm = body.bpm;
    if (body.key !== undefined) payload.key = body.key;
    if (body.genres !== undefined) payload.genres = body.genres;
    if (body.moods !== undefined) payload.moods = body.moods;
    if (body.status !== undefined) payload.status = body.status;
    if (body.visibility !== undefined) payload.visibility = body.visibility;

    const response = await fetch(`${API_URL}/beats/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API error: ${response.status}`);
    }

    const beat = await response.json();
    return NextResponse.json(beat);
  } catch (error: unknown) {
    console.error("Error updating beat:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/beats/[id] - Supprimer un beat
 */
export async function DELETE(
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
    const response = await fetch(`${API_URL}/beats/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error deleting beat:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
