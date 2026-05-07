import { defineConfig } from "vite";
import fs from "node:fs";
import react from "@vitejs/plugin-react";
import babel from "@rollup/plugin-babel";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import url from "node:url";
import path from "node:path";
import sirv from "sirv";

const repoRoot = path.dirname(url.fileURLToPath(import.meta.url));

const PLUGINS_ROOT_PATH = path.resolve("../../plugins");

export default defineConfig({
  resolve: {
    alias: {
      _stores: path.join(repoRoot, "src/stores"),
      _views: path.join(repoRoot, "src/components/views"),
      _styles: path.join(repoRoot, "src/styles"),
      _displays: path.join(repoRoot, "src/components/displays"),
      _menus: path.join(repoRoot, "src/components/menus"),
      _layouts: path.join(repoRoot, "src/components/layouts"),
      _assertions: path.join(repoRoot, "src/errors/assertions.mts"),
      _error: path.join(repoRoot, "src/errors/dqm-demo-error.mts"),
      _utils: path.join(repoRoot, "src/utils"),
      _types: path.join(repoRoot, "src/types"),
      _ranki_v2: path.join(repoRoot, "src/.ranki-v2"),
    },
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      extensions: [".mts", ".ts", ".js", ".mjs"],
      presets: [["@babel/preset-typescript", { allowDeclareFields: true }]],
      plugins: [["@babel/plugin-proposal-decorators", { version: "2023-05" }]],
    }),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    {
      name: "extra-public-dirs",

      configureServer(server) {
        const pluginNames = fs.readdirSync(PLUGINS_ROOT_PATH);
        const publicPaths = [
          "/workdir/src/apps/ranki-v2/build",
          ...pluginNames.map((n) => `${PLUGINS_ROOT_PATH}/${n}/lib`),
        ];

        console.log(
          "Public Paths:\n",
          publicPaths.map((v) => "  " + v).join("\n"),
        );
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
  preview: {
    host: true,
    port: 5000,
  },
  server: {
    host: true,
    port: 5000,
  },
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
