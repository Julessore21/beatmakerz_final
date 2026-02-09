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
    console.log(`[API /beats] Calling backend: ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      // Pas de cache pour toujours avoir les dernières données
      cache: "no-store",
    });

    console.log(`[API /beats] Backend response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error");
      console.error(`[API /beats] Backend error: ${response.status} - ${errorText}`);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API /beats] Success, returned ${data.items?.length || 0} beats`);

    // Le backend retourne { items: Beat[], cursor: string | null }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[API /beats] Error:", error.message, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch beats", items: [] },
      { status: 500 }
    );
  }
}
