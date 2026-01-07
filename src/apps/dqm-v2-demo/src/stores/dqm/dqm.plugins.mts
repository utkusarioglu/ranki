import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import frameV2Html from "@dqm/plugin-frame-v2-html";
import staticRenderEngine from "@dqm/plugin-static-render-engine";
import type { PluginStoreWrapper } from "./dqm.store.types.mts";

// @ts-ignore
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
];

const devPluginSelection = [
  {
    name: "Static Render Engine",
    plugin: staticRenderEngine,
    standard: true,
    requested: true,
    installed: true,
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
    requested: true,
    installed: true,
  },
  {
    name: "ParamsV2",
    plugin: paramsV2,
    standard: false,
    requested: true,
    installed: true,
  },
  {
    name: "FrameV2Code",
    plugin: frameV2Code,
    standard: false,
    requested: false,
    installed: true,
  },
  {
    name: "FrameV2Html",
    plugin: frameV2Html,
    standard: true,
    requested: true,
    installed: true,
  },
];

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
