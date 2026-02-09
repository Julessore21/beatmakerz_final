import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * GET /api/beats - Liste publique des beats (published + public)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Construire l'URL avec les query params
    const params = new URLSearchParams();
    if (searchParams.has("limit")) params.set("limit", searchParams.get("limit")!);
    if (searchParams.has("genre")) params.set("genre", searchParams.get("genre")!);
    if (searchParams.has("bpmMin")) params.set("bpmMin", searchParams.get("bpmMin")!);
    if (searchParams.has("bpmMax")) params.set("bpmMax", searchParams.get("bpmMax")!);
    if (searchParams.has("query")) params.set("query", searchParams.get("query")!);

    const url = `${API_URL}/beats?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      // Pas de cache pour toujours avoir les dernières données
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Le backend retourne { items: Beat[], cursor: string | null }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching beats:", error);
    return NextResponse.json(
      { error: "Failed to fetch beats", items: [] },
      { status: 500 }
    );
  }
}
