import type { RankiPluginParser } from "@ranki/package-api-v2";
import { actions } from "./actions/actions.mjs";
import grammar from "../assets/ohm/2.0.67.ohm?raw";
import { handler } from "./handler.mjs";
import type { RankiLangParserPluginParseHandlerFrameV2 } from "./types/context.mjs";
import type { RankiFrameV2ParserPluginConfig } from "./types/config.mjs";
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
    version: "2.0.67",
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
