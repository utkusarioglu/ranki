import type {
  RankiGrammarTokens,
  RankiPluginGrammar,
} from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.67.ohm?raw";
import { actions } from "./actions.mjs";
import { validators } from "./validators.mjs";
import type { RankiParamsV2ParserPluginConfig } from "./types.mjs";

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

function tokenizer(
  config: RankiParamsV2ParserPluginConfig,
): RankiGrammarTokens {
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

export const rankiParamsV2ParserPlugin: RankiPluginGrammar<RankiParamsV2ParserPluginConfig> =
  {
    type: "grammar",
    meta: {
      name: "RankiParamsV2",
      version: "2.0.67",
    },
    dependencies: ["RankiConstantsV2"],
    config,
    tokenizer: () => tokenizer(config),
    grammar: () => grammar,
    validators,
    actions: () => actions,
  };

export type {
  ArgsAndParamsV2,
  ParamsV2Spec,
  ParamsV2SpecNone,
  ParamsV2SpecPopulated,
  ParamV2,
  ArgsAndParamsV2Reduced,
} from "./types.mjs";

export { applyV2Directives } from "./params.mjs";
