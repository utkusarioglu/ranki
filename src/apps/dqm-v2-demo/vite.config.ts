import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "@rollup/plugin-babel";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
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
  // build: {
  //   rollupOptions: {
  //     // output: {
  //     //   format: "esm",
  //     // },
  //     plugins: [resolve({ extensions: [".mts", ".ts", ".js", ".mjs"] })],
  //   },
  // },
});
