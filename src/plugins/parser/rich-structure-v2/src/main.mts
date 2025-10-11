import { RankiPluginParser } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";

type Single = string;

export interface RankiRichStructureV2ParserPluginConfig {
  tokens: {
    delimiter: Single;
  };
}

export const rankiRichStructureV2ParserPlugin: RankiPluginParser<RankiRichStructureV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiRichStructureV2",
      version: "2.0.63",
    },
    dependencies: ["RankiBaseV2", "RankiParamsV2"],
    config: {
      tokens: {
        delimiter: "~",
      },
    },
    grammar: () => grammar,
    actions: () => actions,
  };
