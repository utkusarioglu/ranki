const PLUGIN_PATHS = [
  "/_ranki2_plugin_sre.js",
  "/_ranki2_plugin_sre_mermaid.js",
  "/_ranki2_plugin_sre_osmd.js",
  "/_ranki2_plugin_sre_music.js",
  "/_ranki2_plugin_sre_code.js",
  "/_ranki2_plugin_framev2_audio.js",
  "/_ranki2_plugin_framev2_code.js",
  "/_ranki2_plugin_framev2_debug.js",
  "/_ranki2_plugin_framev2_html.js",
  "/_ranki2_plugin_framev2_mermaid.js",
  "/_ranki2_plugin_paramsv2.js",
  "/_ranki2_plugin_framev2.js",
  "/_ranki2_plugin_basev2.js",
];

export const pluginsAsObject = await Promise.all(
  PLUGIN_PATHS.map(async (path) => {
    const url = [
      window.location.protocol,
      "/",
      window.location.host,
      path.startsWith("/") ? path.slice(1) : path,
    ].join("/");
    const plugin = (await import(/* @vite-ignore */ url)).default;
    return {
      name: url
        .split("/")
        .at(-1)!
        .split(".")
        .slice(0, -1)
        .join(".")
        .replace("_ranki2_plugin_", ""),
      url,
      path,
      plugin,
    };
  }),
);

export const pluginsAsArray = Object.values(pluginsAsObject).map(
  (v) => v.plugin,
);
