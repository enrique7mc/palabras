import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    exclude: ["**/node_modules/**", "**/e2e/**"],
  },
});
