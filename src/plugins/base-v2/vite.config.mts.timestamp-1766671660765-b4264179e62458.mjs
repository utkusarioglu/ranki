// vite.config.mts
import { defineConfig } from "file:///workdir/.yarn/__virtual__/vite-virtual-3388061c63/2/home/dev/.yarn/berry/cache/vite-npm-7.2.6-ad61dd907f-10c0.zip/node_modules/vite/dist/node/index.js";
import { bundleOhm } from "file:///workdir/src/packages/plugin-utils/lib/bundler.mjs";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZVJvb3QiOiAiZmlsZTovLy93b3JrZGlyL3NyYy9wbHVnaW5zL2Jhc2UtdjIvIiwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya2Rpci9zcmMvcGx1Z2lucy9iYXNlLXYyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya2Rpci9zcmMvcGx1Z2lucy9iYXNlLXYyL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya2Rpci9zcmMvcGx1Z2lucy9iYXNlLXYyL3ZpdGUuY29uZmlnLm10c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyBidW5kbGVPaG0gfSBmcm9tIFwiQGRxbS9wYWNrYWdlLXBsdWdpbi11dGlscy9idW5kbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGRlZmluZToge1xuICAgIC4uLmJ1bmRsZU9obShcIjIuMC42OFwiLCBcIkJBU0VfVjJcIiwgXCIuL3NyYy9wYXJzZXJzL2Jhc2UtdjIvb2htXCIpLFxuICB9LFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IFwic3JjL2V4cG9ydC5tdHNcIixcbiAgICAgIG5hbWU6IFwiQmFzZVYyXCIsXG4gICAgICBmaWxlTmFtZTogXCJleHBvcnRcIixcbiAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHt9LFxuICAgICAgICBkaXI6IFwibGliXCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1EsU0FBUyxvQkFBb0I7QUFDclMsU0FBUyxpQkFBaUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sR0FBRyxVQUFVLFVBQVUsV0FBVywyQkFBMkI7QUFBQSxFQUMvRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDO0FBQUEsTUFDWCxRQUFRO0FBQUEsUUFDTixTQUFTLENBQUM7QUFBQSxRQUNWLEtBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
