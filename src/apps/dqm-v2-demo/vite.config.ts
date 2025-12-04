import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

export default defineConfig({
  plugins: [
    babel({
      babelHelpers: "bundled",
      extensions: [".mts", ".ts", ".js", ".mjs"],
      presets: [["@babel/preset-typescript", { allowDeclareFields: true }]],
      plugins: [["@babel/plugin-proposal-decorators", { version: "2023-05" }]],
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
