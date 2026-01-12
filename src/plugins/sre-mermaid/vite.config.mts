import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/export.mts",
      name: "SRE:Mermaid",
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
