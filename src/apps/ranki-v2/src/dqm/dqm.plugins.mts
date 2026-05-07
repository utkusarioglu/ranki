import staticRenderEngine from "@dqm/plugin-static-render-engine";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import frameV2Audio from "@dqm/plugin-frame-v2-audio";
import frameV2Html from "@dqm/plugin-frame-v2-html";
import frameV2Mermaid from "@dqm/plugin-frame-v2-mermaid";
import frameV2Debug from "@dqm/plugin-frame-v2-debug";
import sreCode from "@dqm/plugin-sre-code";
// import sreMusic from "@dqm/plugin-sre-music";
// import sreOsmd from "@dqm/plugin-sre-osmd";
// import sreMermaid from "@dqm/plugin-sre-mermaid";

const PLUGIN_PATHS = [
  //
  "_ranki2_plugin_sre_mermaid.js",
  "_ranki2_plugin_sre_osmd.js",
  "_ranki2_plugin_sre_music.js",
];

const pluginUrls = PLUGIN_PATHS.map((n) => `${window.location.href}${n}`);
const plugins = (
  await Promise.all(pluginUrls.map((url) => import(/* @vite-ignore */ url)))
).map((v) => v.default);

const pluginsAsObject = {
  staticRenderEngine,
  baseV2,
  frameV2,
  paramsV2,
  frameV2Code,
  sreCode,

  frameV2Debug,
  frameV2Audio,
  frameV2Html,
  frameV2Mermaid,
  // sreMusic,
  // sreOsmd,
};

export const pluginsAsArray = [...Object.values(pluginsAsObject), ...plugins];
