import { RankiPluginParser } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";
import { FrameV1, handler } from "./handler.mjs";

type Single = string;

export interface RankiFrameV1ParserPluginConfig {
  tokens: {
    delimiter: Single;
  };
}

export const rankiFrameV1ParserPlugin: RankiPluginParser<
  RankiFrameV1ParserPluginConfig,
  FrameV1
> = {
  type: "parser",
  meta: {
    version: "2.0.63",
    name: "RankiFrameV1",
  },
  handler,
  dependencies: ["RankiBaseV2"],
  config: {
    tokens: {
      delimiter: ":::",
    },
  },
  grammar: () => grammar,
  actions: () => actions,
};
