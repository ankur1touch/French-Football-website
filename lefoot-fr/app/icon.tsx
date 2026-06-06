import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#003087",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #FFD700",
          position: "relative",
        }}
      >
        {/* "11" badge */}
        <div
          style={{
            background: "#FFD700",
            borderRadius: 4,
            padding: "1px 3px",
            position: "absolute",
            top: 4,
            left: 3,
            fontSize: 7,
            fontWeight: 900,
            color: "#1a1a2e",
            fontFamily: "Arial Black, sans-serif",
            lineHeight: 1,
          }}
        >
          11
        </div>
        {/* "OA" initials */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 900,
            color: "#FFD700",
            fontFamily: "Arial Black, sans-serif",
            letterSpacing: "-0.5px",
            marginTop: 6,
          }}
        >
          OA
        </div>
      </div>
    ),
    { ...size }
  );
}
