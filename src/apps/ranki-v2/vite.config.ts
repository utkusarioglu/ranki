import { defineConfig } from "vite";
import url from "node:url";
import path from "node:path";
import babel from "@rollup/plugin-babel";
import { OUT_DIR, TEMPLATE_FILE } from "./scripts/vite/vite.constants";
import {
  cleanTargets,
  copyArtifacts,
  displayTemplate,
  rankiArtifactActions,
} from "./scripts/vite/ranki-artifact-actions";
import tsConfigPaths from "vite-tsconfig-paths";

const __abspath = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__abspath);

cleanTargets();

export default defineConfig({
  // resolve: {
  //   alias: {
  //     _components: "./src/components",
  //   },
  // },
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    host: true,
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    babel({
      babelHelpers: "bundled",
      extensions: [".mts", ".ts", ".js", ".mjs"],
      presets: [["@babel/preset-typescript", { allowDeclareFields: true }]],
      plugins: [["@babel/plugin-proposal-decorators", { version: "2023-05" }]],
    }),
    rankiArtifactActions([copyArtifacts, displayTemplate]),
  ],
  build: {
    minify: true,
    outDir: OUT_DIR,
    assetsDir: ".",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, TEMPLATE_FILE),
      },
      output: {
        inlineDynamicImports: true,
        entryFileNames: "_ranki2.js",
        chunkFileNames: "_ranki2_[name].js",
        format: "es",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name!.endsWith("css")) {
            return "_ranki2.css";
          }
          if (assetInfo.name!.endsWith("html")) {
            return "_ranki2.html";
          }
          return assetInfo.name!;
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "mathjax-full/js/mathjax.js",
      "mathjax-full/js/input/tex.js",
      "mathjax-full/js/output/svg.js",
    ],
  },
});
