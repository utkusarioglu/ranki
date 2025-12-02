import type {} from "@dqm/package-dqm-api-v2";
import type { IParam, IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { buildContext, grabAst } from "@dqm/package-utils";

const COMPONENT = [["base", "v2", "default"]];
const PARAMS: IParam[] = [];

export const node: IAstNodeActionDict = {
  _iter(...children) {
    return children.map((ch) => ch.separator(buildContext(this)));
  },
  rootBlock_ignore(ignore, wm, rest) {
    return grabAst(this)
      .newAst(this)
      .newCpx((cpx) => cpx.setParams(PARAMS).setIdList(COMPONENT))
      .setKind("parent")
      .setDirection("block")
      .pushNodes(["token", ignore])
      .pushNodes(["space", wm])
      .pushNodes(["subtree", rest]);
  },

  // section_empty(_all) {
  //   const context = c(this).newChild(this, "inline");
  //   return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
  //     kind: "leaf",
  //     print: true,
  //     shape: {
  //       spaces: {},
  //       separators: [],
  //     },
  //   });
  // },
  rootBlock_structure(whitespace1, structure, whitespace2) {
    return grabAst(this)
      .newAst(this)
      .newCpx((cpx) => cpx.setParams(PARAMS).setIdList(COMPONENT))
      .setKind("parent")
      .setDirection("block")
      .pushNodes(["space", whitespace1])
      .pushNodes(["subtree", structure])
      .pushNodes(["space", whitespace2]);
  },

  section_base(block, blockSep, block2) {
    return grabAst(this)
      .newAst(this)
      .setKind("parent")
      .pushNodes(["subtree", block])
      .pushNodes(["token", blockSep], ["subtree", block2]);
  },

  p(line1, nl, line2) {
    return grabAst(this)
      .newAst(this)
      .setKind("parent")
      .pushNodes(["subtree", line1])
      .pushNodes(["space", nl], ["subtree", line2]);
  },

  rootLine(wi1, lexemes, wi2) {
    return grabAst(this)
      .newAst(this)
      .setKind("parent")
      .setDirection("inline")
      .pushNodes(["space", wi1])
      .pushNodes(["subtree", lexemes])
      .pushNodes(["space", wi2]);
  },

  // TODO line modifiers
  line(indentation1, lineModifiers, lexemes, wi) {
    return grabAst(this)
      .newAst(this)
      .setKind("parent")
      .setDirection("inline")
      .pushNodes(["space", indentation1])
      .pushNodes(["token", lineModifiers])
      .pushNodes(["subtree", lexemes])
      .pushNodes(["space", wi]);
  },

  lexemes(lexeme1, clearance, lexeme2) {
    return grabAst(this)
      .newAst(this)
      .setKind("parent")
      .pushNodes(["subtree", lexeme1])
      .pushNodes(["space", clearance], ["subtree", lexeme2]);
  },

  decorated_base(word, wordEnd) {
    return grabAst(this)
      .newAst(this)
      .setKind("parent")
      .pushNodes(["subtree", word])
      .pushNodes(["token", wordEnd]);
  },

  decorated_fallback(word, wordEnd) {
    return grabAst(this)
      .newAst(this)
      .setKind("parent")
      .pushNodes(["subtree", word])
      .pushNodes(["token", wordEnd]);
  },

  word_base(_base) {
    return grabAst(this).newAst(this).setKind("leaf");
  },

  word_number(_number) {
    return grabAst(this)
      .newAst(this)
      .setKind("leaf")
      .setSourceViewDecoder("number", (v) => ({ number: +v }));
  },
};
