import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const cookie = req.headers.get("cookie") || "";

  try {
    const res = await fetch(`${API_URL}/checkout/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      credentials: "include",
      body: "{}",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy checkout session error", error);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}
