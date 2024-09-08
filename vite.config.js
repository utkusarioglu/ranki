import { join } from "node:path";
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, readdirSync } from "node:fs";

const outDir = "build";
const targetDir = "/target";

export default defineConfig({
  plugins: [
    {
      name: "post-build-copy",
      apply: "build",
      buildEnd()
      {
        setTimeout(() =>
        {
          const files = readdirSync(outDir, { withFileTypes: true });
          for (const file of files) {
            if (!file.name.startsWith("_ranki")) {
              console.error("Non ranki files have been created:", file.name);
              return;
            }
            const source = join(outDir, file.name);
            const target = join(targetDir, file.name);
            copyFileSync(source, target);
            console.log(["Copied:", source, "to", target].join(" "));
          }
        }, 3000);
      }
    }
  ],
  build: {
    outDir,
    assetsDir: ".",
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.mts'),  // Adjust the entry point as needed
      },
      output: {
        inlineDynamicImports: false,
        manualChunks: (id) =>
        {
          if (id.includes("mermaid") || id.includes("katex")) {
            return "_ranki_mermaid";
          } else if (id.includes("mathjax.mts")) {
            return "_ranki_mathjax";
          }
        },
        entryFileNames: '_ranki.js',  // The name of your output bundle
        chunkFileNames: "[name].js",
        format: "es",                 // Use 'es' for modern output, or 'iife' for self-contained
        assetFileNames: (assetInfo) =>
        {
          if (assetInfo.name.endsWith("css")) {
            return "_ranki.css";
          }
          return assetInfo.name;
        },
      }
    }
  },
  optimizeDeps: {
    include: ['mathjax-full/js/mathjax.js', 'mathjax-full/js/input/tex.js', 'mathjax-full/js/output/svg.js']
  }
});
