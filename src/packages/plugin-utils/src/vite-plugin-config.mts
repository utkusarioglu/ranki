import { bundleOhm } from "./bundler.mjs";

interface VitePluginConfig {
  name: string;
  bundleOhm?: {
    version: string;
    placeholder: string;
    rootPath: string;
  };
}

export function createVitePluginConfig(props: VitePluginConfig) {
  const plugin_lowered = props.name.toLowerCase().replace(":", "_");
  let ohm = {};
  if (props.bundleOhm) {
    ohm = bundleOhm(
      props.bundleOhm.version,
      props.bundleOhm.placeholder,
      props.bundleOhm.rootPath,
    );
  }
  return {
    define: {
      ...ohm,
    },
    build: {
      lib: {
        entry: "src/export.mts",
        name: props.name,
        fileName: `_ranki2_plugin_${plugin_lowered}`,
        formats: ["es" as "es"],
      },
      minify: true,
      rollupOptions: {
        output: {
          dir: "lib",
          chunkFileNames: `_ranki2_plugin_${plugin_lowered}__[name].js`,
        },
      },
    },
  };
}
