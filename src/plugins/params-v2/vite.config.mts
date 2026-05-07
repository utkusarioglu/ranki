// import { defineConfig } from "vite";
// import { bundleOhm } from "@dqm/package-plugin-utils/bundler";

// defineConfig({
//   define: {
//     ...bundleOhm("2.0.70", "PARAMS_V2", "./src/parsers/params-v2/ohm"),
//   },
//   build: {
//     lib: {
//       entry: "src/export.mts",
//       name: "FrameV2",
//       fileName: "export",
//       formats: ["es"],
//     },
//     rollupOptions: {
//       external: [],
//       output: {
//         globals: {},
//         dir: "lib",
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import { createVitePluginConfig } from "@dqm/package-plugin-utils";

export default defineConfig(
  createVitePluginConfig({
    name: "ParamsV2",
    bundleOhm: {
      version: "2.0.70",
      placeholder: "PARAMS_V2",
      rootPath: "./src/parsers/params-v2/ohm",
    },
  }),
);
