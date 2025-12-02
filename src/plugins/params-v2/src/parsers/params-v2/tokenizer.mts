import type { DqmGrammarTokens } from "@dqm/package-dqm-api-v2";
import type { ParamsV2GrammarConfig } from "./params-v2.types.mjs";

export function tokenizer(config: ParamsV2GrammarConfig): DqmGrammarTokens {
  const tokens: DqmGrammarTokens = {};
  tokens["tParamsV2SeparatorParam"] = config.tokens.separator.param;
  tokens["tParamsV2DirectiveParam"] = config.tokens.key.directive;
  tokens["tParamsV2Negation"] = config.tokens.key.negation;
  tokens["tParamsV2OperatorAssign"] = config.tokens.operators.assign;
  tokens["tParamsV2OperatorAppend"] = config.tokens.operators.append;
  tokens["tParamsV2OperatorRemove"] = config.tokens.operators.remove;
  return tokens;
}
