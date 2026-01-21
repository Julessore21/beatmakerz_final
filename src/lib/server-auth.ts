import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_API_KEY;

export const requireAdmin = (req: NextRequest) => {
  if (!ADMIN_TOKEN) {
    return NextResponse.json({ error: "ADMIN_API_KEY manquant" }, { status: 500 });
  }
  const header = req.headers.get("authorization") ?? "";
  if (header !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
};

export const requireUserId = (req: NextRequest): string | null => {
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  if (!token) return null;
  if (token.startsWith("user:")) {
    return token.replace(/^user:/, "");
  }
  return token;
};
