import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://beatmakerz-api.onrender.com";

/**
 * POST /api/auth/login - Login et stockage du token dans un cookie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Appel au backend pour login
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Login failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Stocker le token dans un cookie HTTP-only
    const cookieStore = await cookies();

    cookieStore.set("accessToken", data.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 heure (duree du token)
      path: "/",
    });

    cookieStore.set("refreshToken", data.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: "/",
    });

    // Retourner les infos utilisateur ET les tokens pour sessionStorage
    return NextResponse.json({
      user: {
        id: data.userId,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
      },
      tokens: {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      },
    });
  } catch (error: any) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
