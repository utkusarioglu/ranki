import type {
  RankiGrammarTokens,
  RankiPluginGrammar,
} from "@ranki/package-api-v2";
import { actions } from "./actions.mjs";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { validators } from "./validators.mjs";
// import { transformers } from "./transformers.mjs";
import type { RankiRichNumberV2ParserPluginConfig } from "./types.mjs";

const config: RankiRichNumberV2ParserPluginConfig = {
  tokens: {
    symbol: {
      complex: ["i", "j", "k"],
      infinity: ["inf", "INF"],
      pi: ["pi", "PI"],
      e: ["e", "E"],
    },
    base: {
      hexadecimal: ["x", "X"],
      octal: ["o", "O"],
      binary: ["b", "B"],
    },
    operator: {
      negative: "-",
      positive: "+",
      minusPlus: ["-+", "∓"],
      plusMinus: ["+-", "±"],
      rational: "/",
    },
    number: {
      decimal: ".",
      group: "_",
    },
  },
};

function tokenizer(config: RankiRichNumberV2ParserPluginConfig) {
  const tokens: RankiGrammarTokens = {};
  tokens["tRichNumberV2SymbolComplex"] = config.tokens.symbol.complex;
  tokens["tRichNumberV2SymbolInfinity"] = config.tokens.symbol.infinity;
  tokens["tRichNumberV2SymbolE"] = config.tokens.symbol.e;
  tokens["tRichNumberV2SymbolPi"] = config.tokens.symbol.pi;
  tokens["tRichNumberV2BaseHexadecimal"] = config.tokens.base.hexadecimal;
  tokens["tRichNumberV2BaseOctal"] = config.tokens.base.octal;
  tokens["tRichNumberV2BaseBinary"] = config.tokens.base.binary;
  tokens["tRichNumberV2OperatorNegative"] = config.tokens.operator.negative;
  tokens["tRichNumberV2OperatorPositive"] = config.tokens.operator.positive;
  tokens["tRichNumberV2OperatorMinusPlus"] = config.tokens.operator.minusPlus;
  tokens["tRichNumberV2OperatorPlusMinus"] = config.tokens.operator.plusMinus;
  tokens["tRichNumberV2OperatorRational"] = config.tokens.operator.rational;
  tokens["tRichNumberV2NumberDecimal"] = config.tokens.number.decimal;
  tokens["tRichNumberV2NumberGroup"] = config.tokens.number.group;
  return tokens;
}

export const rankiRichNumberV2ParserPlugin: RankiPluginGrammar<RankiRichNumberV2ParserPluginConfig> =
  {
    type: "grammar",
    meta: {
      name: "RankiRichNumberV2",
      version: "2.0.63",
    },
    dependencies: ["RankiBaseV2"],
    config,
    tokenizer: () => tokenizer(config),
    grammar: () => grammar,
    validators,
    // transformers,
    actions: () => actions,
  };
