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
            const source = join(outDir, file.name);
            const target = join(targetDir, file.name);
            copyFileSync(source, target);
            console.log(["Copied:", source, "to", target].join(" "));
          }
        }, 1000);
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
        entryFileNames: '_ranki.js',  // The name of your output bundle
        format: 'es',                 // Use 'es' for modern output, or 'iife' for self-contained
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
});