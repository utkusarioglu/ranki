import { defineConfig } from "vite";
import { createVitePluginConfig } from "@dqm/package-plugin-utils";

export default defineConfig(createVitePluginConfig({ name: "SRE:Code" }));
// export default defineConfig({
//   build: {
//     lib: {
//       entry: "src/export.mts",
//       name: "FrameV2:Code",
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
