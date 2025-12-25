import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "@rollup/plugin-babel";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import url from "node:url";
import path from "node:path";

const repoRoot = path.dirname(url.fileURLToPath(import.meta.url));

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
  ],
  preview: {
    host: true,
    port: 5000,
  },
  server: {
    host: true,
    port: 5000,
  },
});
