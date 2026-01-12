import { defineConfig } from "vite";

// export default defineConfig({
//   build: {
//     lib: {
//       entry: "src/export.mts",
//       name: "SRE:Mermaid",
//       fileName: "export",
//       formats: ["es"],
//     },
//     rollupOptions: {
//       external: [],
//       output: {
//         globals: {},
//         dir: "lib",
//       },
//     },
//   },
// });

export default defineConfig({
  build: {
    lib: {
      entry: "src/export.mts",
      name: "SRE:Mermaid",
      fileName: "export",
      formats: ["es"],
    },
    minify: false,
    // target: TARGET,
    // outDir: OUT_DIR,
    // assetsDir: ".",
    rollupOptions: {
      // input: {
      //   main: path.resolve(__dirname, TEMPLATE_FILE),
      // },
      // external: [
      //   "langium" // I have no idea why this causes issues
      // ],
      output: {
        dir: "lib",
        inlineDynamicImports: false,
        manualChunks: (id) => {
          if (id.includes("mermaid") || id.includes("katex")) {
            return "_ranki2_mermaid";
          } else if (id.includes("mathjax.mts")) {
            return "_ranki2_mathjax";
          }
        },
        // entryFileNames: "_ranki2.js", // The name of your output bundle
        // chunkFileNames: "[name].js",
        // format: "es", // Use 'es' for modern output, or 'iife' for self-contained
        // assetFileNames: (assetInfo) => {
        //   if (assetInfo.name!.endsWith("css")) {
        //     return "_ranki2.css";
        //   }
        //   if (assetInfo.name!.endsWith("html")) {
        //     return "_ranki2.html";
        //   }
        //   return assetInfo.name!;
        // },
      },
    },
  },
});
