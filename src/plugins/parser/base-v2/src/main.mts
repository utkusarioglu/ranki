import type { RankiPluginParser } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.65.ohm?raw";
import { actions } from "./actions.mjs";
import { validators } from "./validators.mjs";
import { transformers } from "./transformers.mjs";
import type { RankiBaseV2ParserPluginConfig } from "./type.mjs";
import { handler } from "./handler.mjs";
import { tokenizer } from "./tokenizer.mjs";
import { config } from "./config.mjs";

export const rankiBaseV2ParserPlugin: RankiPluginParser<RankiBaseV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiBaseV2",
      version: "2.0.65",
    },
    handler,
    dependencies: ["RankiConstantsV2"],
    config,
    tokenizer: () => tokenizer(config),
    grammar: () => grammar,
    actions: () => actions,
    validators,
    transformers,
  };

export type { NodeArgsBaseV2 } from "./type.mjs";
