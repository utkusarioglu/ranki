// vite.config.js
import { copyFile, readDir } from "node:fs/promises";
import { defineConfig } from "file:///workdir/.yarn/__virtual__/vite-virtual-c126ff98c1/2/home/node/.yarn/berry/cache/vite-npm-5.4.1-5f1883aa64-10c0.zip/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "/workdir";
var vite_config_default = defineConfig({
  plugins: [
    {
      name: "post-build-copy",
      apply: "build",
      async buildEnd() {
        const files = await readDir("./build", { withFileTypes: true });
        console.log(JSON.stringify(files, null, 2));
      }
    }
  ],
  build: {
    outDir: "build",
    assetsDir: ".",
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "src/main.mts")
        // Adjust the entry point as needed
      },
      output: {
        entryFileNames: "_ranki.js",
        // The name of your output bundle
        format: "es",
        // Use 'es' for modern output, or 'iife' for self-contained
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith("css")) {
            return "_ranki.css";
          }
          return assetInfo.name;
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya2RpclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtkaXIvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtkaXIvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBjb3B5RmlsZSwgcmVhZERpciB9IGZyb20gXCJub2RlOmZzL3Byb21pc2VzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwicG9zdC1idWlsZC1jb3B5XCIsXG4gICAgICBhcHBseTogXCJidWlsZFwiLFxuICAgICAgYXN5bmMgYnVpbGRFbmQoKVxuICAgICAge1xuICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IHJlYWREaXIoXCIuL2J1aWxkXCIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShmaWxlcywgbnVsbCwgMikpO1xuICAgICAgfVxuICAgIH1cbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IFwiYnVpbGRcIixcbiAgICBhc3NldHNEaXI6IFwiLlwiLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL21haW4ubXRzJyksICAvLyBBZGp1c3QgdGhlIGVudHJ5IHBvaW50IGFzIG5lZWRlZFxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ19yYW5raS5qcycsICAvLyBUaGUgbmFtZSBvZiB5b3VyIG91dHB1dCBidW5kbGVcbiAgICAgICAgZm9ybWF0OiAnZXMnLCAgICAgICAgICAgICAgICAgLy8gVXNlICdlcycgZm9yIG1vZGVybiBvdXRwdXQsIG9yICdpaWZlJyBmb3Igc2VsZi1jb250YWluZWRcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+XG4gICAgICAgIHtcbiAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUuZW5kc1dpdGgoXCJjc3NcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBcIl9yYW5raS5jc3NcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFzc2V0SW5mby5uYW1lO1xuICAgICAgICB9LFxuICAgICAgfVxuICAgIH1cbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwTSxTQUFTLFVBQVUsZUFBZTtBQUM1TyxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGVBQWU7QUFGeEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1A7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxNQUNQLE1BQU0sV0FDTjtBQUNFLGNBQU0sUUFBUSxNQUFNLFFBQVEsV0FBVyxFQUFFLGVBQWUsS0FBSyxDQUFDO0FBRTlELGdCQUFRLElBQUksS0FBSyxVQUFVLE9BQU8sTUFBTSxDQUFDLENBQUM7QUFBQSxNQUM1QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLFFBQVEsa0NBQVcsY0FBYztBQUFBO0FBQUEsTUFDekM7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBO0FBQUEsUUFDaEIsUUFBUTtBQUFBO0FBQUEsUUFDUixnQkFBZ0IsQ0FBQyxjQUNqQjtBQUNFLGNBQUksVUFBVSxLQUFLLFNBQVMsS0FBSyxHQUFHO0FBQ2xDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGlCQUFPLFVBQVU7QUFBQSxRQUNuQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
