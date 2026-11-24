import { ImageResponse } from "next/og";

export const alt = "Beatmakerz · Des prods prêtes à poser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image de partage du site : le logo, la promesse, sur le noir du site. */
export default function OpenGraphImage() {
  const bar = (left: number) => (
    <div style={{ position: "absolute", left, top: 26, width: 16, height: 62, borderRadius: 8, background: "#fff", boxShadow: "0 5px 0 #5B2CC9" }} />
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#09090B",
          backgroundImage: "radial-gradient(60% 70% at 85% 0%, rgba(124,92,255,0.28), transparent 70%)",
          color: "#FAFAFA",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ position: "relative", display: "flex", width: 118, height: 124 }}>
            <div style={{ position: "absolute", left: 0, top: 8, width: 116, height: 116, borderRadius: 30, background: "#5B2CC9" }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 116, height: 116, borderRadius: 30, background: "#fff" }} />
            <div style={{ position: "absolute", left: 9, top: 9, width: 98, height: 98, borderRadius: 24, background: "#09090B" }} />
            {bar(26)}
            {bar(50)}
            {bar(74)}
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 8 }}>BEATMAKERZ</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Des prods prêtes à poser.</div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#A1A1AA" }}>Trap, drill, cloud, lofi · licence commerciale · téléchargement immédiat</div>
        </div>
      </div>
    ),
    size,
  );
}
