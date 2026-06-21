"use client";

import { useEffect } from "react";
import { Youtube } from "lucide-react";
import { YouTubeEmbed } from "@/components/lessons/youtube-embed";
import { useLessonProgress } from "@/components/lessons/lesson-progress";
import type { VideoBlock as VideoBlockData } from "@/types/lessons";

export function VideoBlock({ block }: { block: VideoBlockData }) {
  const { markDone } = useLessonProgress();
  // Watching is engagement — award XP once the lesson sees the video block.
  useEffect(() => {
    markDone(block.id);
  }, [block.id, markDone]);

  return (
    <section className="space-y-2">
      {block.title && (
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Youtube className="size-5 text-terminal" />
          {block.title}
        </h2>
      )}
      <YouTubeEmbed youtubeId={block.youtubeId} title={block.title} />
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 font-mono text-xs text-muted-foreground">
        {block.caption && <span>{block.caption}</span>}
        {block.channel && <span className="ml-auto">▸ {block.channel}</span>}
      </div>
    </section>
  );
}
