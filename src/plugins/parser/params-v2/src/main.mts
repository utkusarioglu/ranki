import { RankiGrammarTokens, RankiPluginParser } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.66.ohm?raw";
import { actions } from "./actions.mjs";
import { validators } from "./validators.mjs";
import { transformers } from "./transformers.mjs";

type Single = string;

export interface RankiParamsV2ParserPluginConfig {
  tokens: {
    separator: {
      param: Single;
    };
    key: {
      directive: Single;
      negation: Single;
    };
    operators: {
      assign: Single;
      append: Single;
      remove: Single;
    };
  };
}

export type WithRankiParamsV2ParserPluginConfig = {
  RankiParamsV2: RankiParamsV2ParserPluginConfig;
};

const config: RankiParamsV2ParserPluginConfig = {
  tokens: {
    separator: {
      param: ",",
    },
    key: {
      negation: "!",
      directive: "$",
    },
    operators: {
      assign: "=",
      append: "+=",
      remove: "-=",
    },
  },
};

function tokenize(config: RankiParamsV2ParserPluginConfig): RankiGrammarTokens {
  const tokens: RankiGrammarTokens = {};
  tokens["tParamsV2SeparatorParam"] = config.tokens.separator.param;
  tokens["tParamsV2DirectiveParam"] = config.tokens.key.directive;
  // TODO this doesn't appear in paramsV2. it does appear in Frame V2
  // tokens["tParamsV2SeparatorFrame"] = config.tokens.separator.frame;
  tokens["tParamsV2Negation"] = config.tokens.key.negation;
  tokens["tParamsV2OperatorAssign"] = config.tokens.operators.assign;
  tokens["tParamsV2OperatorAppend"] = config.tokens.operators.append;
  tokens["tParamsV2OperatorRemove"] = config.tokens.operators.remove;
  return tokens;
}

export const rankiParamsV2ParserPlugin: RankiPluginParser<RankiParamsV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiParamsV2",
      version: "2.0.66",
    },
    dependencies: ["RankiConstantsV2"],
    config,
    tokens: tokenize(config),
    grammar: () => grammar,
    validators,
    transformers,
    actions: () => actions,
  };

export type {
  ArgsAndParamsV2,
  ParamsV2Spec,
  ParamsV2SpecNone,
  ParamsV2SpecPopulated,
  ParamV2,
} from "./types.mjs";
export { applyV2Directives } from "./params.mjs";
