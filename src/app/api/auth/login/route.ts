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

    console.log("[API /auth/login] Setting accessToken cookie");
    cookieStore.set("accessToken", data.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes (durée du token)
      path: "/",
    });

    console.log("[API /auth/login] Setting refreshToken cookie");
    cookieStore.set("refreshToken", data.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: "/",
    });

    console.log("[API /auth/login] Cookies set successfully for user:", data.email);

    // Retourner les infos utilisateur (sans les tokens)
    return NextResponse.json({
      user: {
        id: data.userId,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
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
