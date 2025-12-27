import { defineConfig } from "vite";
import { bundleOhm } from "@dqm/package-plugin-utils/bundler";

export default defineConfig({
  define: {
    ...bundleOhm("2.0.69", "PARAMS_V2", "./src/parsers/params-v2/ohm"),
  },
  build: {
    lib: {
      entry: "src/export.mts",
      name: "FrameV2",
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
