import type { RankiPluginComponent } from "@ranki/package-api-v2";
import { rankiBaseDefault } from "./default/default.mjs";

export const rankiBaseV2ComponentsPluginDefault: RankiPluginComponent = {
  meta: {
    name: "RankiBaseV2:Default",
    version: "0.0.0",
  },
  handler: "RankiBaseV2",
  list: [rankiBaseDefault],
};
