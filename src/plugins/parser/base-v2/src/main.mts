import type { RankiPluginParser } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.67.ohm?raw";
import { actions } from "./actions.mjs";
import { validators } from "./validators.mjs";
import type { RankiBaseV2ParserPluginConfig } from "./type.mjs";
import { tokenizer } from "./tokenizer.mjs";
import { config } from "./config.mjs";

export const rankiBaseV2ParserPlugin: RankiPluginParser<RankiBaseV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiBaseV2",
      version: "2.0.67",
    },
    dependencies: ["RankiConstantsV2"],
    config,
    paramParser: () => ({
      config: [],
      message: ["TODO"],
    }),
    tokenizer: () => tokenizer(config),
    grammar: () => grammar,
    actions: () => actions,
    validators,
  };

export type { NodeArgsBaseV2 } from "./type.mjs";
