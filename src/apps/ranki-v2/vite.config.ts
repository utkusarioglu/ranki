import { defineConfig } from "vite";
import url from "node:url";
import path from "node:path";
import babel from "@rollup/plugin-babel";
import { OUT_DIR, TEMPLATE_FILES } from "./scripts/vite/vite.constants";
import {
  cleanRankiTargets,
  copyArtifacts,
  displayTemplates,
  rankiArtifactActions,
} from "./scripts/vite/ranki-artifact-actions";
import tsConfigPaths from "vite-tsconfig-paths";
import { fileBatchLogDriverVitePlugin } from "./src/o11y/log-drivers/file-batch/vite/vite-plugin.mjs";
import { extraPublicDirs } from "./scripts/vite/extra-public-dirs";

const viteConfigPath = url.fileURLToPath(import.meta.url);
const packagePath = path.dirname(viteConfigPath);

const PLUGINS_ROOT_PATH = path.resolve("../../plugins");

const ROLLUP_INPUT = Object.fromEntries(
  Object.entries(TEMPLATE_FILES).map(([key, filename]) => [
    key,
    path.resolve(packagePath, filename),
  ]),
);

export default defineConfig(({ mode }) => ({
  esbuild: {
    keepNames: true,
  },
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
    },
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
    rankiArtifactActions([
      // cleanRankiTargets,
      // copyArtifacts,
      displayTemplates,
    ]),
    fileBatchLogDriverVitePlugin("./.log"),
    extraPublicDirs(PLUGINS_ROOT_PATH),
  ],
  build: {
    target: "esnext",
    minify: true,
    outDir: OUT_DIR,
    assetsDir: ".",
    rollupOptions: {
      input: ROLLUP_INPUT,
      output: {
        entryFileNames: (entry) => {
          return ["_ranki2", entry.name, "js"].filter((v) => !!v).join(".");
        },
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name.replaceAll("-", "_");
          // if (chunkInfo.isEntry) console.log("chung", chunkInfo, name);
          //   // if (chunkInfo.name.includes("index")) {
          //   //   console.log("index chunk:", chunkInfo);
          //   // }
          if (chunkInfo.name === "core.variant") {
            return "_ranki2.js";
          }
          if (chunkInfo.name === "observable.variant") {
            return "_ranki2.o11y.js";
          }
          return `_ranki2__${name}.js`;
        },
        // manualChunks: (id) => {
        //   if (id.includes("/o11y/")) return "observable";
        //   if (id.includes("/devtools/")) return "devtools";

        //   return "core";
        // },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name!.endsWith("css")) {
            return "_ranki2.css";
          }
          if (assetInfo.name!.endsWith("html")) {
            return "_ranki2.html";
          }
          return "_ranki2_" + assetInfo.name!;
        },
      },
    },
  },
}));
