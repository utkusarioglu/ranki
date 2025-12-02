import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { buildContext, grabAst } from "@dqm/package-utils";

export const space: IAstNodeActionDict = {
  _iter(...children) {
    return children.map((ch) => ch.space(buildContext(this)));
  },
  blockSep_base(n1, wi1, nl, wi) {
    return grabAst(this)
      .newAst(this)
      .setKind("leaf")
      .pushIgnoredNodes(n1, wi1, nl, wi);
  },
  clearance(all) {
    return grabAst(this).newAst(this).setKind("leaf").pushIgnoredNodes(all);
  },
  nl(all) {
    return grabAst(this).newAst(this).setKind("leaf").pushIgnoredNodes(all);
  },
  wm(spaces, nl) {
    return grabAst(this)
      .newAst(this)
      .setKind("leaf")
      .pushIgnoredNodes(spaces, nl);
  },
  whitespace(one, two) {
    return grabAst(this)
      .newAst(this)
      .setKind("leaf")
      .pushIgnoredNodes(one, two);
  },
};
