import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { grabAst } from "@dqm/package-utils";

export const token: IAstNodeActionDict = {
  tBaseV2WordEnd(end) {
    return grabAst(this).newAst(end);
  },

  baseV2BlockSep_base(nl1, wi1, nl2, wi2) {
    return grabAst(this).newAst(this).pushIgnoredNodes(nl1, wi1, nl2, wi2);
  },

  baseV2LineModifiers(modifiers) {
    return grabAst(this).newAst(this).pushIgnoredNodes(modifiers);
  },

  tBaseV2Ignore(token) {
    return grabAst(this).newAst(this).pushIgnoredNodes(token);
  },

  tBaseV2QuoteDouble(token) {
    return grabAst(this).newAst(this).pushIgnoredNodes(token);
  },

  tBaseV2QuoteSingle(token) {
    return grabAst(this).newAst(this).pushIgnoredNodes(token);
  },

  nl(nl) {
    return grabAst(this).newAst(this).pushIgnoredNodes(nl);
  },

  end(nl) {
    return grabAst(this).newAst(this).pushIgnoredNodes(nl);
  },
};
