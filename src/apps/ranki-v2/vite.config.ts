import { defineConfig } from "vite";
import fs from "node:fs";
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
import sirv from "sirv";

const viteConfigPath = url.fileURLToPath(import.meta.url);
const packagePath = path.dirname(viteConfigPath);

const PLUGINS_ROOT_PATH = path.resolve("../../plugins");
// console.log("p", pluginsRootAbsPath);

// const mermaidLib = path.resolve("../../plugins/sre-mermaid/lib");

export default defineConfig(() => ({
  esbuild: {
    keepNames: true,
  },
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
    },
    proxy: {
      // "/loki": {
      //   target: "http://loki:3100",
      //   changeOrigin: true,
      // },
      // "/api/v1/otlp": {
      //   target: "http://prometheus:9090",
      //   changeOrigin: true,
      // },
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
      // include: ["../../plugins/**", "../../packages/**"],
    }),
    // babel({
    //   babelHelpers: "bundled",
    //   extensions: [".mts", ".ts", ".js", ".mjs"],
    //   presets: [["@babel/preset-typescript", { allowDeclareFields: true }]],
    //   plugins: [["@babel/plugin-proposal-decorators", { version: "2023-05" }]],
    //   include: ["./src/**"],
    // }),
    rankiArtifactActions([
      // cleanRankiTargets,
      // copyArtifacts,
      displayTemplate,
    ]),
    {
      name: "extra-public-dirs",

      configureServer(server) {
        const pluginNames = fs.readdirSync(PLUGINS_ROOT_PATH);
        const publicPaths = pluginNames.map(
          (n) => `${PLUGINS_ROOT_PATH}/${n}/lib`,
        );
        console.log("Public Paths:\n", "  " + publicPaths.join("\n"));
        for (const p of publicPaths) {
          server.middlewares.use(
            "/",
            sirv(p, {
              dev: true,
            }),
          );
        }
      },
    },
  ],
  build: {
    minify: true,
    outDir: OUT_DIR,
    assetsDir: ".",
    rollupOptions: {
      input: {
        main: path.resolve(packagePath, TEMPLATE_FILE),
      },
      output: {
        entryFileNames: "_ranki2.js",
        chunkFileNames: "_ranki2_[name].js",
        format: "es",
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
          return "_ranki2_" + assetInfo.name!;
        },
      },
    },
  },
}));
