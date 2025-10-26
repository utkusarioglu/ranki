import {
  RankiPluginParser,
  RankiGrammarTokens,
  RankiLangAstContext,
  RankiLangParsedAst,
  RankiLanguageConfig,
} from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.65.ohm?raw";
import { actions } from "./actions.mjs";
import { validators } from "./validators.mjs";
import { transformers } from "./transformers.mjs";
import {
  RankiBaseV2ParserPluginConfig,
  WithRankiBaseV2ParserPluginConfig,
} from "./type.mjs";

const config: RankiBaseV2ParserPluginConfig = {
  tokens: {
    ignore: "% ignore",
    escape: "\\\\",
  },
};

function tokenizer(config: RankiBaseV2ParserPluginConfig) {
  const tokens: RankiGrammarTokens = {};
  tokens["tBaseV2Escape"] = config.tokens.escape;
  tokens["tBaseV2Ignore"] = config.tokens.ignore;
  return tokens;
}

function handler(
  theaterRaw: string,
  context: RankiLangAstContext<{ type: string }>,
): RankiLangParsedAst {
  const config = context.getMergedConfig();
  const theaterWithContent = [
    config.content.prefix,
    theaterRaw,
    config.content.suffix,
  ].join("");

  return context.parseAst(theaterWithContent, context);
}

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
