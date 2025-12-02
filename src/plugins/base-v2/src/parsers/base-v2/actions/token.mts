import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { grabAst } from "@dqm/package-utils";

export const token: IAstNodeActionDict = {
  wordEnd(ig) {
    return grabAst(this).newAst(ig).setKind("leaf");
  },
  lineModifiers(_m) {
    return grabAst(this).newAst(this).setKind("leaf");
  },
};
