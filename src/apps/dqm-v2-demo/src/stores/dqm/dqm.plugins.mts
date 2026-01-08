import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import frameV2Audio from "@dqm/plugin-frame-v2-audio";
import frameV2Html from "@dqm/plugin-frame-v2-html";
import sreMusic from "@dqm/plugin-sre-music";
import staticRenderEngine from "@dqm/plugin-static-render-engine";
import type { PluginStoreWrapper } from "./dqm.store.types.mts";

const defaultPluginSelection = [
  {
    name: "Static Render Engine",
    plugin: staticRenderEngine,
    standard: false,
    requested: false,
    installed: false,
  },
  {
    name: "BaseV2",
    plugin: baseV2,
    standard: true,
    requested: false,
    installed: true,
  },
  {
    name: "FrameV2",
    plugin: frameV2,
    standard: false,
    requested: false,
    installed: false,
  },
  {
    name: "ParamsV2",
    plugin: paramsV2,
    standard: false,
    requested: false,
    installed: false,
  },
  {
    name: "FrameV2Code",
    plugin: frameV2Code,
    standard: false,
    requested: false,
    installed: false,
  },
  {
    name: "FrameV2Html",
    plugin: frameV2Html,
    standard: false,
    requested: false,
    installed: false,
  },
  {
    name: "FrameV2Audio",
    plugin: frameV2Audio,
    standard: false,
    requested: false,
    installed: false,
  },
  {
    name: "SreMusic",
    plugin: sreMusic,
    standard: false,
    requested: false,
    installed: false,
  },
];

const devPluginSelection = defaultPluginSelection.map(({ name, plugin }) => ({
  name,
  plugin,
  standard: true,
  requested: true,
  installed: true,
}));

export const pluginSelectionInit: PluginStoreWrapper[] = devPluginSelection.map(
  ({ name, plugin, standard, requested, installed }, packageIndex) => ({
    name: name,
    enabled: true,
    packageIndex,
    plugins: plugin.map((plugin, pluginIndex) => ({
      packageIndex,
      pluginIndex,

      name: plugin.meta.name,
      description: plugin.meta.description,
      plugin,
      pluginType: plugin.type,

      installed,
      standard,
      requested,
    })),
  }),
);
