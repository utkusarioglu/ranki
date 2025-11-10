import type { RankiPluginComponent } from "@ranki/package-api-v2";
import { codeComponent } from "./components/code/code.component.mjs";
import { anchorComponent } from "./components/anchor/anchor.component.mjs";
import { blockV2Component } from "./components/block/block.component.mjs";

export const rankiFrameV2ComponentsPluginCode: RankiPluginComponent = {
  meta: {
    name: "RankiFrameV2Code",
    version: "0.0.0",
  },
  handler: "RankiFrameV2",
  list: [blockV2Component, codeComponent, anchorComponent],
};
