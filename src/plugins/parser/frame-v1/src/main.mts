import { RankiPluginParser } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";
type Single = string;

export interface RankiFrameV1ParserPluginConfig {
  tokens: {
    delimiter: Single;
  };
}

export const rankiFrameV1ParserPlugin: RankiPluginParser<RankiFrameV1ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      version: "2.0.63",
      name: "RankiFrameV1",
    },
    dependencies: ["RankiBaseV2"],
    config: {
      tokens: {
        delimiter: ":::",
      },
    },
    grammar: () => grammar,
    actions: () => actions,
  };
