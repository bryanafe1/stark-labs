import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS / home-screen icon — same exact Lucide octagon "O", sized up, opaque bg.
const MARK =
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'>` +
  `<rect width='28' height='28' fill='#0A0A0A'/>` +
  `<g transform='translate(2 2)'>` +
  `<path d='M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z' fill='none' stroke='#6366F1' stroke-width='2.5' stroke-linejoin='round' stroke-linecap='round'/>` +
  `</g>` +
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
