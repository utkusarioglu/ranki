import type { RankiPluginComponent } from "@ranki/package-api-v2";
import { tonesComponent } from "./components/tone/component.mjs";
import { easyScoreComponent } from "./components/easyscore/component.mjs";
import { musicYmlComponent } from "./components/musicyml/component.mjs";

export const rankiFrameV2ComponentsPluginAudio: RankiPluginComponent = {
  meta: {
    name: "RankiFrameV2:Audio",
    version: "0.0.0",
  },
  handler: "RankiFrameV2",
  list: [tonesComponent, easyScoreComponent, musicYmlComponent],
};
