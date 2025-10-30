import type { RankiPluginParser } from "@ranki/package-api-v2";
import { actions } from "./actions/actions.mjs";
import grammar from "../assets/ohm/2.0.68.ohm?raw";
import { handler } from "./handler/handler.mjs";
import type { RankiFrameV2ParserPluginConfig } from "./types/config.mjs";
import { tokenizer, config } from "./config.mjs";
import { validators } from "./validators.mjs";
import { transformers } from "./transformers.mjs";

export const rankiFrameV2ParserPlugin: RankiPluginParser<RankiFrameV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiFrameV2",
      version: "2.0.68",
    },
    handler,
    dependencies: ["RankiParamsV2"],
    config,
    tokenizer: () => tokenizer(config),
    grammar: () => grammar,
    validators,
    transformers,
    actions: () => actions,
  };
