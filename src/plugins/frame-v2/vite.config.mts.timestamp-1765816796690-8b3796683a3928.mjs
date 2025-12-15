// vite.config.mts
import { defineConfig } from "file:///workdir/.yarn/__virtual__/vite-virtual-3388061c63/2/home/dev/.yarn/berry/cache/vite-npm-7.2.6-ad61dd907f-10c0.zip/node_modules/vite/dist/node/index.js";
import { bundleOhm } from "file:///workdir/src/packages/utils/lib/bundler.mjs";
var vite_config_default = defineConfig({
  define: {
    ...bundleOhm("2.0.73", "FRAME_V2", "./src/parsers/frame-v2/ohm")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZVJvb3QiOiAiZmlsZTovLy93b3JrZGlyL3NyYy9wbHVnaW5zL2ZyYW1lLXYyLyIsCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3dvcmtkaXIvc3JjL3BsdWdpbnMvZnJhbWUtdjJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93b3JrZGlyL3NyYy9wbHVnaW5zL2ZyYW1lLXYyL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya2Rpci9zcmMvcGx1Z2lucy9mcmFtZS12Mi92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgYnVuZGxlT2htIH0gZnJvbSBcIkBkcW0vcGFja2FnZS11dGlscy9idW5kbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGRlZmluZToge1xuICAgIC4uLmJ1bmRsZU9obShcIjIuMC43M1wiLCBcIkZSQU1FX1YyXCIsIFwiLi9zcmMvcGFyc2Vycy9mcmFtZS12Mi9vaG1cIiksXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogXCJzcmMvZXhwb3J0Lm10c1wiLFxuICAgICAgbmFtZTogXCJGcmFtZVYyXCIsXG4gICAgICBmaWxlTmFtZTogXCJleHBvcnRcIixcbiAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHt9LFxuICAgICAgICBkaXI6IFwibGliXCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlEsU0FBUyxvQkFBb0I7QUFDeFMsU0FBUyxpQkFBaUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sR0FBRyxVQUFVLFVBQVUsWUFBWSw0QkFBNEI7QUFBQSxFQUNqRTtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDO0FBQUEsTUFDWCxRQUFRO0FBQUEsUUFDTixTQUFTLENBQUM7QUFBQSxRQUNWLEtBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
