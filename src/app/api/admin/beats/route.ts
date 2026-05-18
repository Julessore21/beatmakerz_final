import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/utils/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * GET /api/admin/beats - Liste tous les beats (admin)
 */
export async function GET(request: NextRequest) {
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
    const url = `${API_URL}/beats/admin/all`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error");
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return NextResponse.json(Array.isArray(data) ? data : data.items || []);
  } catch (error) {
    console.error("Error fetching beats:", error);
    return NextResponse.json(
      { error: "Failed to fetch beats" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/beats - Créer un nouveau beat
 */
export async function POST(request: NextRequest) {
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

    const payload = {
      artistId: body.artistId,
      title: body.title,
      bpm: body.bpm,
      key: body.key,
      genres: body.genres || [],
      moods: body.moods || [],
      status: body.status || "draft",
      visibility: body.visibility || "public",
    };

    const response = await fetch(`${API_URL}/beats`, {
      method: "POST",
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

    // Si on a des fichiers à uploader, on les uploade maintenant
    const beatId = beat._id;

    // Upload cover si présent
    if (body.coverFile) {
      // Note: coverFile doit être uploadé avant via /api/admin/upload
      // Ici on update juste le beat avec l'URL
    }

    return NextResponse.json(beat);
  } catch (error: unknown) {
    console.error("Error creating beat:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
