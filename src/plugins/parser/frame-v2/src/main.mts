import { RankiPluginParser } from "@ranki/package-api";
import { actions } from "./actions/actions.mjs";
import grammar from "../assets/ohm/2.0.65.ohm?raw";

export const rankiFrameV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  meta: {
    name: "RankiFrameV2",
    version: "2.0.65",
  },
  dependencies: ["RankiParamsV2"],
  grammar: () => grammar,
  actions: () => actions,
};
