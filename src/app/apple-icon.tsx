import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS / home-screen icon — same octagon "O" mark, sized up, opaque background.
const MARK =
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'>` +
  `<rect width='180' height='180' fill='#0A0A0A'/>` +
  `<path d='M62 24 H118 L156 62 V118 L118 156 H62 L24 118 V62 Z' fill='none' stroke='#6366F1' stroke-width='22' stroke-linejoin='round'/>` +
  `</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width="180" height="180" src={`data:image/svg+xml,${encodeURIComponent(MARK)}`} alt="" />
      </div>
    ),
    { ...size },
  );
}
