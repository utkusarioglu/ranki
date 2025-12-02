import type * as ohm from "ohm-js";
import { getAst } from "@dqm/package-utils";
import type { IAstNode, IParam } from "@dqm/package-dqm-api-v2";
import { buildContext } from "@dqm/package-utils";

const COMPONENT = [["base", "v2", "default"]];
const PARAMS: IParam[] = [];

type AstDict = ohm.ActionDict<IAstNode[] | IAstNode>;

const token: AstDict = {
  wordEnd(ig) {
    return getAst(this).newAst().setKind("leaf").setOhmNode(ig);
  },
  lineModifiers(_m) {
    return getAst(this).newAst().setKind("leaf").setOhmNode(this);
  },
};

const space: AstDict = {
  _iter(...children) {
    return children.map((ch) => ch.space(buildContext(this)));
  },
  blockSep_base(_n1, _wi1, _nl, _wi) {
    return getAst(this).newAst().setKind("leaf").setOhmNode(this);
  },
  clearance(_all) {
    return getAst(this).newAst().setKind("leaf").setOhmNode(this);
  },
  nl(_all) {
    return getAst(this).newAst().setKind("leaf").setOhmNode(this);
  },
  whitespace(_one, _two) {
    return getAst(this).newAst().setKind("leaf").setOhmNode(this);
  },
};

const node: AstDict = {
  _iter(...children) {
    return children.map((ch) => ch.separator(buildContext(this)));
  },
  rootBlock_ignore(ignore, wm, rest) {
    return getAst(this)
      .newAst()
      .newCpx((cpx) => cpx.setParams(PARAMS).setIdList(COMPONENT))
      .setOhmNode(this)
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
    return getAst(this)
      .newAst()
      .newCpx((cpx) => cpx.setParams(PARAMS).setIdList(COMPONENT))
      .setOhmNode(this)
      .setKind("parent")
      .setDirection("block")
      .pushNodes(["space", whitespace1])
      .pushNodes(["subtree", structure])
      .pushNodes(["space", whitespace2]);
  },

  section_base(block, blockSep, block2) {
    return getAst(this)
      .newAst()
      .setOhmNode(this)
      .setKind("parent")
      .pushNodes(["subtree", block])
      .pushNodes(["token", blockSep], ["subtree", block2]);
  },

  p(line1, nl, line2) {
    return getAst(this)
      .newAst()
      .setOhmNode(this)
      .setKind("parent")
      .pushNodes(["subtree", line1])
      .pushNodes(["space", nl], ["subtree", line2]);
  },

  // rootLine(wi1, lexemes, wi2) {
  //   const context = c(this).newChild(this, "inline");
  //   return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
  //     {
  //       kind: "parent",
  //       shape: {
  //         spaces: {
  //           prefix: {
  //             type: "wi",
  //             raw: wi1.sourceString,
  //           },
  //           suffix: {
  //             type: "wi",
  //             raw: wi2.sourceString,
  //           },
  //         },
  //         separators: [],
  //       },
  //     },
  //     {
  //       children: [lexemes.node(context)],
  //     },
  //   );
  // },

  // // TODO line modifiers
  line(indentation1, lineModifiers, lexemes, wi) {
    return getAst(this)
      .newAst()
      .setOhmNode(this)
      .setKind("parent")
      .setDirection("inline")
      .pushNodes(["space", indentation1])
      .pushNodes(["token", lineModifiers])
      .pushNodes(["subtree", lexemes])
      .pushNodes(["space", wi]);
  },

  lexemes(lexeme1, clearance, lexeme2) {
    return getAst(this)
      .newAst()
      .setOhmNode(this)
      .setKind("parent")
      .pushNodes(["subtree", lexeme1])
      .pushNodes(["space", clearance], ["subtree", lexeme2]);
  },

  decorated_base(word, wordEnd) {
    return getAst(this)
      .newAst()
      .setOhmNode(this)
      .setKind("parent")
      .pushNodes(["subtree", word])
      .pushNodes(["token", wordEnd]);
  },

  // decorated_fallback(word, wordEnd) {
  //   const parentContext = c(this).newChild(this);
  //   return parentContext.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
  //     {
  //       kind: "parent",
  //       shape: {
  //         spaces: {
  //           suffix: {
  //             type: wordEnd.creatorName(parentContext),
  //             raw: wordEnd.sourceString,
  //           },
  //         },
  //         separators: [],
  //       },
  //     },
  //     {
  //       subtree: {},
  //       children: [
  //         (() => {
  //           const leafContext = parentContext.newChild(this);
  //           return leafContext.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
  //             kind: "leaf",
  //             print: true,
  //             shape: {
  //               spaces: {},
  //               separators: [],
  //             },
  //             source: {
  //               type: "raw",
  //               raw: word.sourceString,
  //             },
  //           });
  //         })(),
  //       ],
  //     },
  //   );
  // },

  word_base(_base) {
    return getAst(this).newAst().setOhmNode(this).setKind("leaf");
  },

  // word_number(_number) {
  //   const context = c(this).newChild(this);
  //   return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
  //     kind: "leaf",
  //     print: true,
  //     shape: {
  //       spaces: {},
  //       separators: [],
  //     },
  //     source: {
  //       type: "number",
  //       raw: this.sourceString,
  //       number: +this.sourceString,
  //     },
  //   });
  // },

  // // TODO should this exist?
  // clearance(_clearance1) {
  //   const context = c(this).newChild(this);
  //   return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>(
  //     {
  //       kind: "leaf",
  //       print: true,
  //       shape: {
  //         spaces: {},
  //         separators: [],
  //       },
  //     },
  //     {
  //       sourceType: "text",
  //     },
  //   );
  // },

  // // TODO should this exist?
  // whitespace(_wm, _wi) {
  //   const context = c(this).newChild(this);
  //   return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>(
  //     {
  //       kind: "leaf",
  //       print: true,
  //       shape: {
  //         spaces: {},
  //         separators: [],
  //       },
  //     },
  //     {
  //       sourceType: "text",
  //     },
  //   );
  // },
};

// const creatorName: ohm.ActionDict<string> = {
// nl(_nl) {
//   return this.ctorName;
// },
// end(_end) {
//   return this.ctorName;
// },
// clearance(_clearance1) {
//   return this.ctorName;
// },
// };

// const nodeList: ohm.ActionDict<IAstNode[]> = {
//   _iter(...children) {
//     return children.map((ch) => ch.node(c(this)));
//   },
// };

export const actions = {
  node,
  space,
  token,
};
