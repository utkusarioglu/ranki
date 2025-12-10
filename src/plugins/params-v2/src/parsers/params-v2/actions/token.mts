import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { grabAst } from "@dqm/package-utils";

export const token: IAstNodeActionDict = {
  tParamsV2SeparatorParam(end) {
    return grabAst(this).newAst(end);
  },

  tParamsV2OperatorAssign(end) {
    return grabAst(this).newAst(end);
  },

  tParamsV2SeparatorKeyLevel(end) {
    return grabAst(this).newAst(end);
  },
};
