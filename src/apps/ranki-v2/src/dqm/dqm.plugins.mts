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

const pluginUrls = PLUGIN_PATHS.map(
  (n) => `${window.location.href}${n.startsWith("/") ? n.slice(1) : n}`,
);
export const pluginsAsArray = (
  await Promise.all(pluginUrls.map((url) => import(/* @vite-ignore */ url)))
).map((v) => v.default);
