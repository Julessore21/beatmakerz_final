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
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/checkout/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error");

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Session expired - Please login again" },
          { status: 401 }
        );
      }

      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[API /checkout/session] Error:", error.message, error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
