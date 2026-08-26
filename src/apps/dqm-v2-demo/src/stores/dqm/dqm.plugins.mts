// import staticRenderEngine from "@dqm/plugin-static-render-engine";
// import baseV2 from "@dqm/plugin-base-v2";
// import frameV2 from "@dqm/plugin-frame-v2";
// import paramsV2 from "@dqm/plugin-params-v2";
// import frameV2Code from "@dqm/plugin-frame-v2-code";
// import frameV2Audio from "@dqm/plugin-frame-v2-audio";
// import frameV2Html from "@dqm/plugin-frame-v2-html";
// import frameV2Mermaid from "@dqm/plugin-frame-v2-mermaid";
// import sreMusic from "@dqm/plugin-sre-music";
// import frameV2Debug from "@dqm/plugin-frame-v2-debug";
// import sreOsmd from "@dqm/plugin-sre-osmd";
// import sreCode from "@dqm/plugin-sre-code";
// import sreMermaid from "@dqm/plugin-sre-mermaid";

// const pluginsAsObjectOld = {
//   staticRenderEngine,
//   baseV2,
//   frameV2,
//   paramsV2,
//   frameV2Debug,
//   frameV2Code,
//   frameV2Audio,
//   frameV2Html,
//   frameV2Mermaid,
//   sreMusic,
//   sreOsmd,
//   sreCode,
//   sreMermaid,
// };

// export const pluginsAsArrayOld = Object.values(pluginsAsObjectOld);

// export const devPluginSelectionOld = Object.entries(pluginsAsObjectOld).map(
//   ([k, v]) => ({
//     name: k,
//     plugin: v,
//     standard: true,
//     requested: true,
//     installed: true,
//   }),
// );

// console.log("d", devPluginSelectionOld);

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
      path,
      plugin,
      url,
    };
  }),
);

export const pluginsAsArray = Object.values(pluginsAsObject).map(
  (v) => v.plugin,
);

export const devPluginSelection = Object.values(pluginsAsObject).map((o) => ({
  installed: true,
  name: o.name,
  plugin: o.plugin,
  requested: true,
  standard: true,
}));
