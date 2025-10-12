import type { RankiPluginCommon } from "./general.mjs";

export interface RankiPluginRenderer extends RankiPluginCommon {
  type: "renderer";
}
