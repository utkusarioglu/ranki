import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

export default {
  input: "src/main.mts",
  output: {
    file: "dist/console.js",
    format: "esm",
  },
  plugins: [
    resolve({ extensions: [".mts", ".ts", ".js", ".mjs"] }),
    babel({
      babelHelpers: "bundled",
      extensions: [".mts", ".ts", ".js", ".mjs"],
      presets: [["@babel/preset-typescript", { allowDeclareFields: true }]],
      plugins: [["@babel/plugin-proposal-decorators", { version: "2023-05" }]],
    }),
  ],
};
