interface VitePluginConfig {
  name: string;
}

export function createVitePluginConfig(props: VitePluginConfig) {
  const plugin_lowered = props.name.toLowerCase().replace(":", "_");
  return {
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
