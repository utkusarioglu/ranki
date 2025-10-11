import { RankiPluginParser } from "@ranki/package-api-v2";
import { actions } from "./actions/actions.mjs";
import grammar from "../assets/ohm/2.0.65.ohm?raw";

type Single = string;

export interface RankiFrameV2ParserPluginConfig {
  tokens: {
    pause: Single;
    directive: Single;
    frame: Single;
  };
}

export const rankiFrameV2ParserPlugin: RankiPluginParser<RankiFrameV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiFrameV2",
      version: "2.0.65",
    },
    dependencies: ["RankiParamsV2"],
    config: {
      tokens: {
        pause: ",",
        directive: "%",
        frame: ":",
      },
    },
    grammar: () => grammar,
    actions: () => actions,
  };
