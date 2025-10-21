import {
  RankiPluginParser,
  RankiGrammarTokens,
  RankiLangAstContext,
  RankiLangParsedAst,
} from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.65.ohm?raw";
import { actions } from "./actions.mjs";
import { validators } from "./validators.mjs";
import { transformers } from "./transformers.mjs";

type Single = string;

export interface RankiBaseV2ParserPluginConfig {
  tokens: {
    ignore: Single;
    escape: Single;
  };
}

const config: RankiBaseV2ParserPluginConfig = {
  tokens: {
    ignore: "% ignore",
    escape: "\\\\",
  },
};

function tokenize(config: RankiBaseV2ParserPluginConfig) {
  const tokens: RankiGrammarTokens = {};
  tokens["tBaseV2Escape"] = config.tokens.escape;
  tokens["tBaseV2Ignore"] = config.tokens.ignore;
  return tokens;
}

function handler(
  theaterRaw: string,
  context: RankiLangAstContext<{ type: string }>,
  // hooks: RankiLangParseHandlerHooks,
): RankiLangParsedAst {
  const contentConfig = context.hooks.getConfig().merged.content;

  const theaterWithContent = [
    contentConfig.prefix,
    theaterRaw,
    contentConfig.suffix,
  ].join("");

  // TODO this isn't needed. it doesn't change anything
  // const newContext: RankiLangAstContext = {
  //   hooks: context.hooks,
  //   blockDepth: context.blockDepth,
  //   inlineDepth: context.inlineDepth,
  //   theater: context.theater,
  //   role: context.role,
  //   startRule: context.startRule,
  // };
  // const parseAst = context.hooks.createAstParser(context);

  return context.hooks.parseAst(theaterWithContent, context);
}

export const rankiBaseV2ParserPlugin: RankiPluginParser<RankiBaseV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiBaseV2",
      version: "2.0.65",
    },
    handler: handler,
    dependencies: ["RankiConstantsV2"],
    config,
    tokens: tokenize(config),
    grammar: () => grammar,
    actions: () => actions,
    validators,
    transformers,
  };

export type { NodeArgsBaseV2 } from "./type.mjs";
