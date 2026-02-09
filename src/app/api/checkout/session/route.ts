import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * POST /api/checkout/session - Create Stripe checkout session
 */
export async function POST(request: NextRequest) {
  try {
    // Essayer de récupérer le token depuis les cookies (admin) ou depuis le header Authorization (users)
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("accessToken")?.value;
    const authHeader = request.headers.get("Authorization");
    const headerToken = authHeader?.replace("Bearer ", "");

    const accessToken = cookieToken || headerToken;

    if (!accessToken) {
      console.error("[API /checkout/session] No access token found in cookies or headers");
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    console.log("[API /checkout/session] Creating Stripe checkout session");

    const response = await fetch(`${API_URL}/checkout/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });

    console.log(`[API /checkout/session] Backend response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error");
      console.error(`[API /checkout/session] Backend error: ${response.status} - ${errorText}`);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Session expired - Please login again" },
          { status: 401 }
        );
      }

      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("[API /checkout/session] Success, returning checkout URL");

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[API /checkout/session] Error:", error.message, error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
