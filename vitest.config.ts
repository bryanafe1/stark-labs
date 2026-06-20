import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Unit tests for isolated, pure modules (grading core, etc.). Node env — no DOM.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
