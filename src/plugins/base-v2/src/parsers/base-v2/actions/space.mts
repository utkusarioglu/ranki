import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { buildContext, grabAst } from "@dqm/package-utils";

export const space: IAstNodeActionDict = {
  _iter(...children) {
    return children.map((ch) => ch.space(buildContext(this)));
  },
  blockSep_base(_n1, _wi1, _nl, _wi) {
    return grabAst(this).newAst(this).setKind("leaf");
  },
  clearance(_all) {
    return grabAst(this).newAst(this).setKind("leaf");
  },
  nl(_all) {
    return grabAst(this).newAst(this).setKind("leaf");
  },
  whitespace(_one, _two) {
    return grabAst(this).newAst(this).setKind("leaf");
  },
};
