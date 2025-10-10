import { RankiPluginParser } from "@ranki/package-api";
import grammar from "../assets/ohm/2.0.64.ohm?raw";
import { actions } from "./actions.mjs";

type Single = string;

export interface RankiBaseV2ParserPluginConfig {
  tokens: {
    escape: Single;
  };
}

export const rankiBaseV2ParserPlugin: RankiPluginParser<RankiBaseV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiBaseV2",
      version: "2.0.64",
    },
    dependencies: ["RankiConstantsV2"],
    config: {
      tokens: {
        escape: "\\\\",
      },
    },
    grammar: () => grammar,
    actions: () => actions,
  };

export type { NodeArgsBaseV2 } from "./type.mjs";
