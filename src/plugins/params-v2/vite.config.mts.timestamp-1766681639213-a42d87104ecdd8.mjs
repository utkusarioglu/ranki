// vite.config.mts
import { defineConfig } from "file:///workdir/.yarn/__virtual__/vite-virtual-3388061c63/2/home/dev/.yarn/berry/cache/vite-npm-7.2.6-ad61dd907f-10c0.zip/node_modules/vite/dist/node/index.js";
import { bundleOhm } from "file:///workdir/src/packages/plugin-utils/lib/bundler.mjs";
var vite_config_default = defineConfig({
  define: {
    ...bundleOhm("2.0.68", "PARAMS_V2", "./src/parsers/params-v2/ohm")
  },
  build: {
    lib: {
      entry: "src/export.mts",
      name: "FrameV2",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZVJvb3QiOiAiZmlsZTovLy93b3JrZGlyL3NyYy9wbHVnaW5zL3BhcmFtcy12Mi8iLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi93b3JrZGlyL3NyYy9wbHVnaW5zL3BhcmFtcy12MlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtkaXIvc3JjL3BsdWdpbnMvcGFyYW1zLXYyL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya2Rpci9zcmMvcGx1Z2lucy9wYXJhbXMtdjIvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGJ1bmRsZU9obSB9IGZyb20gXCJAZHFtL3BhY2thZ2UtcGx1Z2luLXV0aWxzL2J1bmRsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgZGVmaW5lOiB7XG4gICAgLi4uYnVuZGxlT2htKFwiMi4wLjY4XCIsIFwiUEFSQU1TX1YyXCIsIFwiLi9zcmMvcGFyc2Vycy9wYXJhbXMtdjIvb2htXCIpLFxuICB9LFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IFwic3JjL2V4cG9ydC5tdHNcIixcbiAgICAgIG5hbWU6IFwiRnJhbWVWMlwiLFxuICAgICAgZmlsZU5hbWU6IFwiZXhwb3J0XCIsXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7fSxcbiAgICAgICAgZGlyOiBcImxpYlwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThRLFNBQVMsb0JBQW9CO0FBQzNTLFNBQVMsaUJBQWlCO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLEdBQUcsVUFBVSxVQUFVLGFBQWEsNkJBQTZCO0FBQUEsRUFDbkU7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFNBQVMsQ0FBQyxJQUFJO0FBQUEsSUFDaEI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQztBQUFBLE1BQ1gsUUFBUTtBQUFBLFFBQ04sU0FBUyxDQUFDO0FBQUEsUUFDVixLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
