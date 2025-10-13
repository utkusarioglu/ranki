import type { RankiPluginParser } from "@ranki/package-api-v2";
import { actions } from "./actions/actions.mjs";
import grammar from "../assets/ohm/2.0.66.ohm?raw";
import { handler } from "./handler.mjs";
import type {
  RankiFrameV2ParserPluginConfig,
  RankiLangParserPluginParseHandlerFrameV2,
} from "./types.mjs";
import { tokenize, config } from "./config.mjs";
import { validators } from "./validators.mjs";
import { transformers } from "./transformers.mjs";

export type Single = string;

export const rankiFrameV2ParserPlugin: RankiPluginParser<
  RankiFrameV2ParserPluginConfig,
  RankiLangParserPluginParseHandlerFrameV2
> = {
  type: "parser",
  meta: {
    name: "RankiFrameV2",
    version: "2.0.66",
  },
  handler,
  dependencies: ["RankiParamsV2"],
  config,
  tokens: tokenize(config),
  grammar: () => grammar,
  validators,
  transformers,
  actions: () => actions,
};
