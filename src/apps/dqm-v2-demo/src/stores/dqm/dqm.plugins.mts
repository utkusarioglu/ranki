import baseV2 from "@dqm/plugin-base-v2";
import frameV2 from "@dqm/plugin-frame-v2";
import paramsV2 from "@dqm/plugin-params-v2";
import frameV2Code from "@dqm/plugin-frame-v2-code";
import type { PluginData } from "./dqm.store.types.mts";

export const pluginSelectionInit: PluginData[] = [
  {
    name: "BaseV2",
    plugin: baseV2,
    enabled: true,
    installed: true,
  },
  {
    name: "FrameV2",
    plugin: frameV2,
    enabled: false,
    installed: false,
  },
  {
    name: "ParamsV2",
    plugin: paramsV2,
    enabled: false,
    installed: false,
  },
  {
    name: "FrameV2Code",
    plugin: frameV2Code,
    enabled: false,
    installed: false,
  },
].map(({ name, plugin, enabled, installed }, pluginIndex) => ({
  name: name,
  enabled,
  pluginIndex,
  installed,
  members: plugin.map((member, memberIndex) => ({
    name: member.meta.name,
    description: member.meta.description,
    member,
    pluginIndex,
    memberIndex,
    memberType: member.type,
    enabled: true,
  })),
}));
