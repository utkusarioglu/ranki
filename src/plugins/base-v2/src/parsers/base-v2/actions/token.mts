import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { grabAst } from "@dqm/package-utils";

export const token: IAstNodeActionDict = {
  wordEnd(end) {
    return grabAst(this).newAst(end).setKind("leaf");
  },
  blockSep_base(nl1, wi1, nl2, wi2) {
    return grabAst(this)
      .newAst(this)
      .setKind("leaf")
      .pushIgnoredNodes(nl1, wi1, nl2, wi2);
  },
  lineModifiers(modifiers) {
    return grabAst(this)
      .newAst(this)
      .setKind("leaf")
      .pushIgnoredNodes(modifiers);
  },
  tBaseV2Ignore(token) {
    return grabAst(this).newAst(this).setKind("leaf").pushIgnoredNodes(token);
  },
};
