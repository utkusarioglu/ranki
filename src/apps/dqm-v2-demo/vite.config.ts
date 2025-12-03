import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
        format: "esm",
      },
      plugins: [
        resolve({ extensions: [".mts", ".ts", ".js", ".mjs"] }),
        babel({
          babelHelpers: "bundled",
          extensions: [".mts", ".ts", ".js", ".mjs"],
          presets: [["@babel/preset-typescript", { allowDeclareFields: true }]],
          plugins: [
            ["@babel/plugin-proposal-decorators", { version: "2023-05" }],
          ],
        }),
      ],
    },
  },
});
