import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { buildContext, grabAst } from "@dqm/package-plugin-utils";

export const space: IAstNodeActionDict = {
  _iter(...children) {
    return children.map((ch) => ch.space(buildContext(this)));
  },

  baseV2BlockSep_base(n1, wi1, nl, wi) {
    return grabAst(this).newAst(this).pushIgnoredNodes(n1, wi1, nl, wi);
  },

  sBaseV2Clearance(all) {
    return grabAst(this).newAst(this).pushIgnoredNodes(all);
  },

  sBaseV2Indentation(all) {
    return grabAst(this).newAst(this).pushIgnoredNodes(all);
  },

  sBaseV2WasteInline(all) {
    return grabAst(this).newAst(this).pushIgnoredNodes(all);
  },

  sBaseV2WasteMultiline(spaces, nl) {
    return grabAst(this).newAst(this).pushIgnoredNodes(spaces, nl);
  },

  sBaseV2Whitespace(one, two) {
    return grabAst(this).newAst(this).pushIgnoredNodes(one, two);
  },

  nl(all) {
    return grabAst(this).newAst(this).pushIgnoredNodes(all);
  },
};
