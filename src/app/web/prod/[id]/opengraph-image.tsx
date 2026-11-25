import { ImageResponse } from "next/og";
import { fetchBeat } from "@/lib/catalog";
import { coverStyleOf } from "@/lib/coverStyle";

export const alt = "Prod Beatmakerz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** L'aperçu d'une prod partagée : sa pochette de style, son titre, ses vraies données. */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beat = await fetchBeat(id, { signal: AbortSignal.timeout(4000), cache: "no-store" }).catch(() => null);
  const style = coverStyleOf(beat?.genres);
  const title = beat?.title ?? "Beatmakerz";
  const meta = beat ? [beat.genres[0], beat.bpm ? `${beat.bpm} BPM` : null, beat.key].filter(Boolean).join("  ·  ") : "Prods pour rappeurs";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: style.bg,
          backgroundImage: `radial-gradient(70% 90% at 85% 100%, ${style.accent}cc, transparent 70%), radial-gradient(50% 60% at 0% 0%, ${style.accent}55, transparent 70%)`,
          color: style.fg,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 6, opacity: 0.85 }}>
          <span>BEATMAKERZ</span>
          <span>{style.id === "default" ? "PROD" : style.label.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: title.length > 18 ? 104 : 140, fontWeight: 700, letterSpacing: -5, lineHeight: 0.9, textTransform: "uppercase" }}>{title}</div>
          <div style={{ marginTop: 28, fontSize: 28, letterSpacing: 4, opacity: 0.8, textTransform: "uppercase" }}>{meta}</div>
        </div>
      </div>
    ),
    size,
  );
}
