import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "AnonyZap — Instant Chat Rooms";
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #075E54 0%, #128C7E 50%, #25D366 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Chat bubble icon */}
        <svg width="100" height="100" viewBox="0 0 512 512" style={{ marginBottom: 24 }}>
          <rect x="60" y="80" width="392" height="320" rx="40" fill="rgba(255,255,255,0.15)" />
          <path
            d="M100 380V160c0-22 18-40 40-40h232c22 0 40 18 40 40v160c0 22-18 40-40 40H180l-80 60V380Z"
            fill="white"
            opacity="0.95"
          />
          <line x1="170" y1="200" x2="342" y2="200" stroke="#075E54" strokeWidth="16" strokeLinecap="round" />
          <line x1="170" y1="260" x2="300" y2="260" stroke="#075E54" strokeWidth="16" strokeLinecap="round" />
          <line x1="170" y1="320" x2="240" y2="320" stroke="#075E54" strokeWidth="16" strokeLinecap="round" />
        </svg>

        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          AnonyZap
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.85)",
            margin: "12px 0 0",
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          Instant Chat Rooms — No Signup, No Storage, No Tracking
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
