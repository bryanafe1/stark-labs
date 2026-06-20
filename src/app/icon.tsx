import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Generated favicon — the Stark hexagon mark on the near-black canvas.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#f5f5f5",
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
