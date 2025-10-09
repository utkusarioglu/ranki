import { RankiPluginParser } from "@ranki/package-api";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";

export const rankiRichTextV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  meta: {
    name: "RankiRichTextV2",
    version: "2.0.63",
  },
  dependencies: ["RankiBaseV2"],
  grammar: () => grammar,
  actions: () => actions,
};
