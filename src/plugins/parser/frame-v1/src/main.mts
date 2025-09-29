import { RankiPluginParser } from "@ranki/package-api";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";

export const rankiFrameV1ParserPlugin: RankiPluginParser = {
  type: "parser",
  version: "2.0.63",
  name: "RankiFrameV1",
  dependencies: ["RankiBaseV2"],
  grammar: () => grammar,
  actions: () => actions,
};
