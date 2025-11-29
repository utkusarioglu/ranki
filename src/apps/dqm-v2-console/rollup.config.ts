// // rollup.config.js
// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import swcPlugin from "rollup-plugin-swc";

// export default {
//   input: "src/main.mts",
//   output: {
//     file: "dist/console.js",
//     format: "esm",
//   },
//   plugins: [
//     resolve(),
//     commonjs(),
//     // @ts-ignore
//     swcPlugin.default({
//       jsc: {
//         parser: { syntax: "typescript", decorators: true },
//         transform: { legacyDecorator: false, decoratorMetadata: false },
//         target: "es2023",
//       },
//     }),
//   ],
// };

// rollup.config.js
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
