import { RankiPluginParser } from "@ranki/package-api";
import { actions } from "./actions.mjs";
import grammar from "../assets/ohm/2.0.63.ohm?raw";

export const rankiFrameV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  name: "RankiFrameV2",
  version: "2.0.63",
  dependencies: ["RankiParamsV2"],
  grammar: () => grammar,
  actions: () => actions,
};
