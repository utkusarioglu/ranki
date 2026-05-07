// import { defineConfig } from "vite";
// import { bundleOhm } from "@dqm/package-plugin-utils/bundler";

// export default defineConfig({
//   define: {
//     ...bundleOhm("2.0.74", "FRAME_V2", "./src/parsers/frame-v2/ohm"),
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
    name: "FrameV2",
    bundleOhm: {
      version: "2.0.74",
      placeholder: "FRAME_V2",
      rootPath: "./src/parsers/frame-v2/ohm",
    },
  }),
);
