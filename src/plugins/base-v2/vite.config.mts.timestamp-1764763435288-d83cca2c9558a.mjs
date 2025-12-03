// vite.config.mts
import { defineConfig } from "file:///workdir/.yarn/__virtual__/vite-virtual-3388061c63/2/home/dev/.yarn/berry/cache/vite-npm-7.2.6-ad61dd907f-10c0.zip/node_modules/vite/dist/node/index.js";
import { bundleOhm } from "file:///workdir/src/packages/utils/lib/bundler.mjs";
var vite_config_default = defineConfig({
  define: {
    ...bundleOhm("2.0.68", "BASE_V2", "./src/parsers/base-v2/ohm")
  },
  build: {
    lib: {
      entry: "src/export.mts",
      name: "BaseV2",
      fileName: "export",
      formats: ["es"]
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        dir: "lib"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZVJvb3QiOiAiZmlsZTovLy93b3JrZGlyL3NyYy9wbHVnaW5zL2Jhc2UtdjIvIiwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya2Rpci9zcmMvcGx1Z2lucy9iYXNlLXYyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya2Rpci9zcmMvcGx1Z2lucy9iYXNlLXYyL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya2Rpci9zcmMvcGx1Z2lucy9iYXNlLXYyL3ZpdGUuY29uZmlnLm10c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyBidW5kbGVPaG0gfSBmcm9tIFwiQGRxbS9wYWNrYWdlLXV0aWxzL2J1bmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgZGVmaW5lOiB7XG4gICAgLi4uYnVuZGxlT2htKFwiMi4wLjY4XCIsIFwiQkFTRV9WMlwiLCBcIi4vc3JjL3BhcnNlcnMvYmFzZS12Mi9vaG1cIiksXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogXCJzcmMvZXhwb3J0Lm10c1wiLFxuICAgICAgbmFtZTogXCJCYXNlVjJcIixcbiAgICAgIGZpbGVOYW1lOiBcImV4cG9ydFwiLFxuICAgICAgZm9ybWF0czogW1wiZXNcIl0sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW10sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZ2xvYmFsczoge30sXG4gICAgICAgIGRpcjogXCJsaWJcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3USxTQUFTLG9CQUFvQjtBQUNyUyxTQUFTLGlCQUFpQjtBQUUxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixHQUFHLFVBQVUsVUFBVSxXQUFXLDJCQUEyQjtBQUFBLEVBQy9EO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUM7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNOLFNBQVMsQ0FBQztBQUFBLFFBQ1YsS0FBSztBQUFBLE1BQ1A7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
