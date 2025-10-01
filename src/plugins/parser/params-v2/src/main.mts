import { RankiPluginParser } from "@ranki/package-api";
import grammar from "../assets/ohm/2.0.64.ohm?raw";
import { actions } from "./actions.mjs";

export const rankiParamsV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  name: "RankiParamsV2",
  version: "2.0.64",
  dependencies: ["RankiConstantsV2"],
  grammar: () => grammar,
  actions: () => actions,
};

export type { ArgsAndParamsV2, ParamsV2Spec } from "./types.mjs";
export { applyV2Directives } from "./params.mjs";
