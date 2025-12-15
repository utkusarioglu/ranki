import { defineConfig } from "vite";
import { bundleOhm } from "@dqm/package-plugin-utils/bundler";

export default defineConfig({
  define: {
    ...bundleOhm("2.0.68", "BASE_V2", "./src/parsers/base-v2/ohm"),
  },
  build: {
    lib: {
      entry: "src/export.mts",
      name: "BaseV2",
      fileName: "export",
      formats: ["es"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        dir: "lib",
      },
    },
  },
});
