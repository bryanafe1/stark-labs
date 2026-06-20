"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Lazy YouTube facade: shows the thumbnail + play button, and only loads the
 * (privacy-friendly, no-cookie) iframe on click. Fast first paint, no tracking
 * until the user opts in.
 */
export function YouTubeEmbed({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video${title ? `: ${title}` : ""}`}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={title ?? "Video thumbnail"}
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            loading="lazy"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-terminal/90 text-background shadow-lg transition-transform group-hover:scale-110">
              <Play className="size-7 translate-x-0.5 fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
