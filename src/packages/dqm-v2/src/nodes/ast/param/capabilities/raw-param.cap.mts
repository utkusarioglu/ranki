import type { IAstParamNode, Operator } from "@dqm/package-dqm-api-v2";
import { ALL_AUDIENCES } from "../param.constants.mjs";

const DEFAULT_OPERATOR: Operator = "assign";

export function astParamCapability<T>(self: T) {
  let astParam: IAstParamNode | null = null;

  return {
    setAstParam(r: IAstParamNode): T {
      astParam = r;
      return self;
    },
    getAstParam: () => astParam,
    getAudience: () => astParam?.getAudience() || ALL_AUDIENCES,
    getOperator: () => astParam?.getOperator() || DEFAULT_OPERATOR,
    getValues: () => astParam?.getValues() || null,
  };
}
