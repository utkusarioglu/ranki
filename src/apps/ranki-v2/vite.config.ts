import { defineConfig } from "vite";
import url from "node:url";
import path from "node:path";
import babel from "@rollup/plugin-babel";
import { OUT_DIR, TEMPLATE_FILE } from "./scripts/vite/vite.constants";
import {
  cleanRankiTargets,
  copyArtifacts,
  displayTemplate,
  rankiArtifactActions,
} from "./scripts/vite/ranki-artifact-actions";
import tsConfigPaths from "vite-tsconfig-paths";
import { fileBatchLogDriverVitePlugin } from "./src/o11y/log-drivers/file-batch/vite/vite-plugin.mjs";
import { extraPublicDirs } from "./scripts/vite/extra-public-dirs";

const viteConfigPath = url.fileURLToPath(import.meta.url);
const packagePath = path.dirname(viteConfigPath);

const PLUGINS_ROOT_PATH = path.resolve("../../plugins");

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
    // proxy: {
    // "/loki": {
    //   target: "http://loki:3100",
    //   changeOrigin: true,
    // },
    // "/api/v1/otlp": {
    //   target: "http://prometheus:9090",
    //   changeOrigin: true,
    // },
    // },
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
      displayTemplate,
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
      input: {
        main: path.resolve(packagePath, TEMPLATE_FILE),
      },
      output: {
        format: "es",
        entryFileNames: ["_ranki2", mode !== "production" && mode, "js"]
          .filter((v) => !!v)
          .join("."),
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name.replaceAll("-", "_");
          if (chunkInfo.name.includes("index")) console.log(chunkInfo);
          return `_ranki2__${name}.js`;
        },
        manualChunks(id) {
          if (id.includes("@phosphor-icons")) {
            return "icons";
          }
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name!.endsWith("css")) {
            return "_ranki2.css";
          }
          if (assetInfo.name!.endsWith("html")) {
            return "_ranki2.html";
          }
          return "_ranki2__" + assetInfo.name!;
        },
      },
    },
  },
}));
