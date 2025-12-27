import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { grabAst } from "@dqm/package-plugin-utils";

export const token: IAstNodeActionDict = {
  tParamsV2SeparatorParam(end) {
    return grabAst(this).newAst(end);
  },

  tParamsV2OperatorAssign(end) {
    return grabAst(this).newAst(end).setMeaning("assign");
  },

  tParamsV2OperatorAppend(end) {
    return grabAst(this).newAst(end).setMeaning("append");
  },

  tParamsV2OperatorRemove(end) {
    return grabAst(this).newAst(end).setMeaning("remove");
  },

  tParamsV2SeparatorKeyLevel(end) {
    return grabAst(this).newAst(end);
  },

  tParamsV2Negation(end) {
    return grabAst(this).newAst(end).setMeaning("negation");
  },

  tParamsV2DirectiveParam(end) {
    return grabAst(this).newAst(end).setMeaning(end.sourceString);
  },

  paramsV2SepInline(
    sBaseV2WasteInline1,
    tParamsV2SeparatorParam,
    sBaseV2WasteInline2,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["space", sBaseV2WasteInline1])
      .pushNodes(["token", tParamsV2SeparatorParam])
      .pushNodes(["space", sBaseV2WasteInline2]);
  },
};
