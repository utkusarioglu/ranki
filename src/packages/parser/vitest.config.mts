import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true, // optional, so you can write `test()` instead of `it()`
    include: ["test/**/*.mts"], // optional if you're not using default filenames
  },
});
