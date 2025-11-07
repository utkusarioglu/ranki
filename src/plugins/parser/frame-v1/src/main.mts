import type {
  RankiGrammarTokens,
  RankiPluginParser,
} from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.64.ohm?raw";
import { actions } from "./actions.mjs";
// import { handler } from "./handler.mjs";
// import { transformers } from "./transformers.mjs";
import { validators } from "./validators.mjs";
import type { RankiFrameV1ParserPluginConfig } from "./types.mjs";

const config: RankiFrameV1ParserPluginConfig = {
  tokens: {
    delimiter: ":::",
    separator: {
      param: ";",
    },
  },
};

function tokenizer(config: RankiFrameV1ParserPluginConfig) {
  const tokens: RankiGrammarTokens = {};
  tokens["tFrameV1Delimiter"] = config.tokens.delimiter;
  tokens["tFrameV1SeparatorParam"] = config.tokens.separator.param;
  return tokens;
}

export const rankiFrameV1ParserPlugin: RankiPluginParser<RankiFrameV1ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      version: "2.0.64",
      name: "RankiFrameV1",
    },
    // handler,
    dependencies: ["RankiBaseV2"],
    config,
    // !TODO
    paramParser: () => ({ config: [], message: "TODO" }),
    tokenizer: () => tokenizer(config),
    grammar: () => grammar,
    validators,
    // transformers,
    actions: () => actions,
  };
