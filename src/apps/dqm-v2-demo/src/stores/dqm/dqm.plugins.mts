import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import type { PluginStoreWrapper } from "./dqm.store.types.mts";

export const pluginSelectionInit: PluginStoreWrapper[] = [
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
].map(({ name, plugin, standard, requested, installed }, packageIndex) => ({
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
}));
