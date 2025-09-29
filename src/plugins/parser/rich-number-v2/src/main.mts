import { RankiPluginParser } from "@ranki/package-api";
import { actions } from "./actions.mjs";
import grammar from "../assets/ohm/2.0.63.ohm?raw";

export const rankiRichNumberV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  name: "RankiRichNumberV2",
  version: "2.0.63",
  dependencies: ["RankiBaseV2"],
  grammar: () => grammar,
  actions: () => actions,
};
