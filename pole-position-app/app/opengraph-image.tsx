import { ImageResponse } from "next/og";

export const alt = "Pole Position — the ultimate Formula 1 companion";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 20% 0%, rgba(44,140,255,0.35), transparent 55%), radial-gradient(circle at 100% 100%, rgba(232,0,45,0.35), transparent 55%), #05070A",
          color: "#F5F7FA",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "sans-serif",
            fontSize: 28,
            letterSpacing: "0.3em",
            color: "rgba(245,247,250,0.7)",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#E8002D",
              boxShadow: "0 0 24px rgba(232,0,45,0.8)",
            }}
          />
          FORMULA 1
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "sans-serif",
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            POLE POSITION
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "sans-serif",
              fontSize: 32,
              color: "rgba(245,247,250,0.75)",
              maxWidth: 720,
              lineHeight: 1.4,
            }}
          >
            Live standings, race weekend timeline, session countdowns and the
            full F1 calendar — instantly converted to your local timezone.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
