import type { GradeStatus } from "@/lib/grading";

// Kept out of the "use server" action module: files with "use server" may only
// export async functions, so shared types/constants live here instead.
export interface PracticeFormState {
  status: GradeStatus | "idle" | "error";
  score?: number;
  feedback?: string;
}

export const INITIAL_PRACTICE_STATE: PracticeFormState = { status: "idle" };
