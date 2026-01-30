import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/logout - Logout et suppression des cookies
 */
export async function POST() {
  const cookieStore = await cookies();

  // Supprimer les cookies
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return NextResponse.json({ message: "Logged out successfully" });
}
