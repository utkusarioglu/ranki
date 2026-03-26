import staticRenderEngine from "@dqm/plugin-static-render-engine";
import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import frameV2Audio from "@dqm/plugin-frame-v2-audio";
import frameV2Html from "@dqm/plugin-frame-v2-html";
import frameV2Mermaid from "@dqm/plugin-frame-v2-mermaid";
import sreMusic from "@dqm/plugin-sre-music";
import frameV2Debug from "@dqm/plugin-frame-v2-debug";
import sreOsmd from "@dqm/plugin-sre-osmd";
import sreCode from "@dqm/plugin-sre-code";
import sreMermaid from "@dqm/plugin-sre-mermaid";

const pluginsAsObject = {
  // staticRenderEngine,
  baseV2,
  frameV2,
  paramsV2,
  frameV2Debug,
  frameV2Code,
  frameV2Audio,
  frameV2Html,
  frameV2Mermaid,
  // sreMusic,
  // sreOsmd,
  // sreCode,
  // sreMermaid,
};

export const pluginsAsArray = Object.values(pluginsAsObject);

export const devPluginSelection = Object.entries(pluginsAsObject).map(
  ([k, v]) => ({
    name: k,
    plugin: v,
    standard: true,
    requested: true,
    installed: true,
  }),
);
