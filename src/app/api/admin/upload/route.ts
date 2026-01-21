import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-auth";

const FILEUP_UPLOAD_URL = process.env.FILEUP_UPLOAD_URL || "https://file-up.fr/api/sharex/upload";
const FILEUP_API_KEY = process.env.FILEUP_API_KEY;

export async function POST(req: NextRequest) {
  const authResponse = requireAdmin(req);
  if (authResponse) {
    return authResponse;
  }

  if (!FILEUP_API_KEY) {
    return NextResponse.json({ error: "FILEUP_API_KEY manquant" }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Aucun fichier détecté" }, { status: 400 });
  }

  const uploadForm = new FormData();
  uploadForm.append("file", file, file instanceof File ? file.name : "upload");

  const uploadRes = await fetch(FILEUP_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FILEUP_API_KEY}`,
    },
    body: uploadForm,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    return NextResponse.json({ error: "Upload FileUp échoué", details: errText }, { status: uploadRes.status });
  }

  const payload = await uploadRes.json();
  const downloadLink = payload?.downloadLink;
  if (!downloadLink) {
    return NextResponse.json({ error: "Aucun downloadLink retourné par FileUp" }, { status: 502 });
  }

  return NextResponse.json({ downloadLink });
}
