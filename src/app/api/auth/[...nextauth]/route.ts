import { handlers } from "@/auth";

// Prisma adapter needs the Node runtime.
export const runtime = "nodejs";

export const { GET, POST } = handlers;
