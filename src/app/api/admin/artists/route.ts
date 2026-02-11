import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * GET /api/admin/artists - Liste tous les artistes
 */
export async function GET(request: NextRequest) {
  // Récupérer le token depuis les cookies OU depuis le header Authorization
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("accessToken")?.value;
  const authHeader = request.headers.get("Authorization");
  const headerToken = authHeader?.replace("Bearer ", "");

  const accessToken = cookieToken || headerToken;

  console.log("[API /admin/artists] Access token present:", !!accessToken);

  if (!accessToken) {
    console.error("[API /admin/artists] No access token found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Note: Il faudra créer cet endpoint dans le backend si il n'existe pas
    // Pour l'instant on retourne un artiste par défaut
    const artists = [
      {
        _id: "5138a0fa-def1-4330-b668-3efd949b8485",
        name: "BeatMaster",
        verified: true,
      },
    ];

    return NextResponse.json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}
