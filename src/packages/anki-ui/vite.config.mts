import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      // Entry point of your plugin
      entry: "src/export.mts",
      name: "RankiFrameV2:Latex",
      fileName: "export",
      formats: ["es"], // optional: both ESM and UMD
    },
    rollupOptions: {
      // Tell Vite to treat external deps (if any) properly
      external: [],
      output: {
        globals: {},
        dir: "lib",
      },
    },
  },
});
