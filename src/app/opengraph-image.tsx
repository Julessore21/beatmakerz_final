import { ImageResponse } from "next/og";

export const alt = "Beatmakerz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background:
            "radial-gradient(circle at 15% 15%, rgba(124,92,255,0.55) 0%, rgba(79,43,212,0.25) 35%, #090912 70%)",
          backgroundColor: "#090912",
          color: "#FFFFFF",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#9F8CFF",
            marginBottom: 24,
          }}
        >
          Prods · Beats · Sons sur mesure
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 150,
            fontWeight: 900,
            letterSpacing: 6,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          BEATMAKERZ
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            padding: "16px 36px",
            borderRadius: 999,
            backgroundColor: "#4F2BD4",
            fontSize: 30,
            fontWeight: 700,
            textTransform: "uppercase",
            alignSelf: "flex-start",
          }}
        >
          Qualité et prix abordable
        </div>
      </div>
    ),
    { ...size }
  );
}
