import type {
  RankiGrammarTokens,
  RankiPluginGrammar,
} from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";
import { validators } from "./validators.mjs";
// import { transformers } from "./transformers.mjs";
import type { RankiRichStructureV2ParserPluginConfig } from "./types.mjs";

const config: RankiRichStructureV2ParserPluginConfig = {
  tokens: {
    delimiter: "~",
  },
};

function tokenizer(
  config: RankiRichStructureV2ParserPluginConfig,
): RankiGrammarTokens {
  const tokens: RankiGrammarTokens = {};
  tokens["tRichStructureV2Delimiter"] = config.tokens.delimiter;
  return tokens;
}

export const rankiRichStructureV2ParserPlugin: RankiPluginGrammar<RankiRichStructureV2ParserPluginConfig> =
  {
    type: "grammar",
    meta: {
      name: "RankiRichStructureV2",
      version: "2.0.63",
    },
    dependencies: ["RankiBaseV2", "RankiParamsV2"],
    config,
    tokenizer: () => tokenizer(config),
    grammar: () => grammar,
    validators,
    // transformers,
    actions: () => actions,
  };
