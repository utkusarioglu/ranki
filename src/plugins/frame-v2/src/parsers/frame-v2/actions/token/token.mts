import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { grabAst } from "@dqm/package-plugin-utils";

export const token: IAstNodeActionDict = {
  tFrameV2SeparatorParam(token) {
    return grabAst(this).newAst(this).pushIgnoredNodes(token);
  },

  tFrameV2LeftOuter(token) {
    return grabAst(this).newAst(this).pushIgnoredNodes(token);
  },

  tFrameV2RightOuter(token) {
    return grabAst(this).newAst(this).pushIgnoredNodes(token);
  },
};
