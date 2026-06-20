import { ProseBlock } from "@/components/lessons/blocks/prose-block";
import { FormulaBlock } from "@/components/lessons/blocks/formula-block";
import { SandboxBlock } from "@/components/lessons/blocks/sandbox-block";
import { WalkthroughBlock } from "@/components/lessons/blocks/walkthrough-block";
import { CheckBlock } from "@/components/lessons/blocks/check-block";
import { CalloutBlock } from "@/components/lessons/blocks/callout-block";
import { WorkedExampleBlock } from "@/components/lessons/blocks/worked-example-block";
import { VideoBlock } from "@/components/lessons/blocks/video-block";
import { PredictBlock } from "@/components/lessons/blocks/predict-block";
import type { LessonBlock as LessonBlockData } from "@/types/lessons";

/** Dispatches a lesson block to its renderer (discriminated on `kind`). */
export function LessonBlock({ block }: { block: LessonBlockData }) {
  switch (block.kind) {
    case "PROSE":
      return <ProseBlock block={block} />;
    case "FORMULA":
      return <FormulaBlock block={block} />;
    case "SANDBOX":
      return <SandboxBlock block={block} />;
    case "WALKTHROUGH":
      return <WalkthroughBlock block={block} />;
    case "CHECK":
      return <CheckBlock block={block} />;
    case "CALLOUT":
      return <CalloutBlock block={block} />;
    case "WORKED_EXAMPLE":
      return <WorkedExampleBlock block={block} />;
    case "VIDEO":
      return <VideoBlock block={block} />;
    case "PREDICT":
      return <PredictBlock block={block} />;
  }
}
