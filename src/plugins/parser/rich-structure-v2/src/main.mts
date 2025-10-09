import { RankiPluginParser } from "@ranki/package-api";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";

export const rankiRichStructureV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  meta: {
    name: "RankiRichStructureV2",
    version: "2.0.63",
  },
  dependencies: ["RankiBaseV2", "RankiParamsV2"],
  grammar: () => grammar,
  actions: () => actions,
};
