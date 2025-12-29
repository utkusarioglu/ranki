import type { IAstParamNode, Operator } from "@dqm/package-dqm-api-v2";
import { ALL_AUDIENCES } from "../param.constants.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

const DEFAULT_OPERATOR: Operator = "assign";

const MESSAGE = "AstParam has to be coupled for this value to be called";

export function astParamCapability<T>(self: T) {
  let astParam: IAstParamNode | null = null;

  return {
    setAstParam(r: IAstParamNode): T {
      astParam = r;
      return self;
    },
    isCoupled: () => astParam !== null,
    getAstParam: () => astParam,
    getAudience: () => astParam?.getAudience() || ALL_AUDIENCES,
    getOperator: () => astParam?.getOperator() || DEFAULT_OPERATOR,
    getValues: () => {
      assertExists(astParam, { why: MESSAGE });
      return astParam.getValues();
    },
  };
}
