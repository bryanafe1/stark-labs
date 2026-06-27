import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Overclocker favicon — an octagon that doubles as the "O", indigo on near-black.
const MARK =
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>` +
  `<rect width='64' height='64' rx='15' fill='#0A0A0A'/>` +
  `<path d='M22 8 H42 L56 22 V42 L42 56 H22 L8 42 V22 Z' fill='none' stroke='#6366F1' stroke-width='8.5' stroke-linejoin='round'/>` +
  `</svg>`;

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width="64" height="64" src={`data:image/svg+xml,${encodeURIComponent(MARK)}`} alt="" />
      </div>
    ),
    { ...size },
  );
}
