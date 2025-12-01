import type * as ohm from "ohm-js";
import { getAst } from "@dqm/package-utils";
import type {
  IAstNode,
  IAstSpaceNode,
  IAstTokenNode,
} from "@dqm/package-dqm-api-v2";
// import { getContext as c } from "@ranki/package-api-v2/helpers";
// import { joinNodes } from "@ranki/package-api-v2/helpers";
// import type {
//   BaseV2Node,
//   BaseV2NodeLeafReduced,
//   BaseV2NodeParentReduced,
// } from "./type.mjs";
// export interface SeparatorEntry {
//   type:
//     | "block"
//     | "clearance"
//     | "nl"
//     | "whitespace"
//     // ! fix this doesn't belong here. it belongs in richStructure
//     | "structure";
//   raw: string;
// }

const COMPONENT = [["base", "v2", "default"]];

type TokenDict = ohm.ActionDict<IAstTokenNode[] | IAstTokenNode>;
type SpaceDict = ohm.ActionDict<IAstSpaceNode[] | IAstSpaceNode>;
type AstDict = ohm.ActionDict<IAstNode[] | IAstNode>;

// const separatorList: TokenDict = {};
const token: TokenDict = {
  wordEnd(ig) {
    return {
      type: ig.ctorName,
      raw: ig.sourceString,
    };
  },
};

const space: SpaceDict = {
  _iter(...children) {
    // TODO this exposes this.args.context
    return children.map((ch) => ch.separator(this.args.context));
  },
  blockSep_base(_n1, _wi1, _nl, _wi) {
    return {
      type: "block",
      raw: this.sourceString,
    };
  },
  clearance(_all) {
    return {
      type: "clearance",
      raw: this.sourceString,
    };
  },
  nl(_all) {
    return {
      type: "nl",
      raw: this.sourceString,
    };
  },
  whitespace(_one, _two) {
    return {
      type: "whitespace",
      raw: this.sourceString,
    };
  },
};

const node: AstDict = {
  _iter(...children) {
    // TODO this exposes this.args.context
    return children.map((ch) => ch.separator(this.args.context));
  },
  rootBlock_ignore(ignore, wm, rest) {
    return (
      getAst(this)
        .newAst()
        .newCpx((cpx) => cpx.setParams([]).setIdList(COMPONENT))
        .setOhmNode(this)
        .setKind("parent")
        // .pushTokenNode("start", "wm", "token", ignore)
        .pushSpaceNode(ignore, rest, wm)
        .pushSubtreeNode(rest)
    );
    // const context = c(this)
    //   .newComponentBoundary({
    //     handler: "RankiBaseV2",
    //     chain: ["base", "v2", "default"],
    //     params: [],
    //   })
    //   .newChild(this, "inline");
    // return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
    //   {
    //     kind: "parent",
    //     shape: {
    //       spaces: {
    //         ignoreAndRest: {
    //           type: "wm",
    //           raw: wm.sourceString,
    //         },
    //       },
    //       separators: [],
    //     },
    //   },
    //   {
    //     children: [
    //       (() => {
    //         const leafContext = context.newChild(this);
    //         return leafContext.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
    //           kind: "leaf",
    //           print: true,
    //           shape: {
    //             spaces: {},
    //             separators: [],
    //           },
    //           source: {
    //             type: "raw",
    //             raw: rest.sourceString,
    //           },
    //         });
    //       })(),
    //     ],
    //   },
    // );
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
    return (
      getAst(this)
        .newAst()
        .newCpx((cpx) => cpx.setParams([]).setIdList(COMPONENT))
        .setOhmNode(this)
        .setKind("parent")
        .pushSpaceNode(null, structure, whitespace1)
        .pushSubtreeNode(structure)
        // .setChildrenNodes([structure])
        .pushSpaceNode(structure, null, whitespace2)
    );
    // .pushSubtreeNode("rest", "node", rest)

    // const context = c(this)
    //   .newComponentBoundary({
    //     handler: "RankiBaseV2",
    //     chain: ["base", "v2", "default"],
    //     params: [],
    //   })
    //   .newChild(this);
    // return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
    //   {
    //     kind: "parent",
    //     shape: {
    //       spaces: {
    //         prefix: {
    //           type: "whitespace",
    //           raw: whitespace1.sourceString,
    //         },
    //         suffix: {
    //           type: "whitespace",
    //           raw: whitespace2.sourceString,
    //         },
    //       },
    //       separators: [],
    //     },
    //   },
    //   {
    //     children: [structure.node(context)],
    //   },
    // );
  },

  section_base(block, _blockSep, _block2) {
    return getAst(this)
      .newAst()
      .setOhmNode(this)
      .setKind("parent")
      .pushSubtreeNode(block);
    // .setChildrenNodes([block], [block2]);
    //   const context = c(this).newChild(this);
    //   return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
    //     {
    //       kind: "parent",
    //       shape: {
    //         spaces: {},
    //         separators: blockSep.separator(context),
    //       },
    //     },
    //     {
    //       children: joinNodes(context, block, block2),
    //     },
    //   );
  },

  // // TODO nl
  p(line1, _nl, _line2) {
    return getAst(this)
      .newAst()
      .setOhmNode(this)
      .setKind("parent")
      .pushSubtreeNode(line1);
    // .setChildrenNodes([line1], [line2]);
    // const context = c(this).newChild(this);
    // return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
    //   {
    //     kind: "parent",
    //     shape: {
    //       spaces: {},
    //       separators: nl.separator(context),
    //     },
    //   },
    //   {
    //     children: joinNodes(context, line1, line2),
    //   },
    // );
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
  line(indentation1, lineModifiers, lexemes, wi1) {
    return (
      getAst(this)
        .newAst()
        .setOhmNode(this)
        .setKind("parent")
        .pushSpaceNode(null, lineModifiers, indentation1)
        // .setChildrenNodes([lexemes])
        .pushSubtreeNode(lexemes)
        .pushSpaceNode(lexemes, null, wi1)
    );
    //   const context = c(this).newChild(this, "inline");
    //   return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
    //     {
    //       kind: "parent",
    //       shape: {
    //         spaces: {
    //           prefix: {
    //             type: "indentation",
    //             raw: indentation1.sourceString,
    //           },
    //           suffix: {
    //             type: "wi",
    //             raw: wi1.sourceString,
    //           },
    //         },
    //         separators: [],
    //       },
    //     },
    //     {
    //       children: [lexemes.node(context)],
    //     },
    //   );
  },

  // // TODO clearance
  lexemes(lexeme1, _clearance, _lexeme2) {
    return getAst(this)
      .newAst()
      .setOhmNode(this)
      .setKind("parent")
      .pushSubtreeNode(lexeme1);
    // .pushSpaceNode(null, lineModifiers, indentation1)
    // .setChildrenNodes([lexeme1], [lexeme2])
    // .pushSpaceNode(lexemes, null, wi1);
    //   const context = c(this).newChild(this);
    //   return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
    //     {
    //       kind: "parent",
    //       shape: {
    //         spaces: {},
    //         separators: clearance.separator(context),
    //       },
    //     },
    //     {
    //       subtree: {},
    //       children: joinNodes(context, lexeme1, lexeme2),
    //     },
    //   );
  },

  decorated_base(word, wordEnd) {
    return (
      getAst(this)
        .newAst()
        .setOhmNode(this)
        .setKind("parent")
        // .pushSpaceNode(null, lineModifiers, indentation1)
        // .setChildrenNodes([word])
        .pushSubtreeNode(word)
        .pushTokenNode(word, null, wordEnd)
    );
    //   const context = c(this).newChild(this);
    //   return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
    //     {
    //       kind: "parent",
    //       shape: {
    //         spaces: {
    //           suffix: {
    //             // !fix this would return an `any` type
    //             type: wordEnd.creatorName(context),
    //             raw: wordEnd.sourceString,
    //           },
    //         },
    //         separators: [],
    //       },
    //     },
    //     {
    //       subtree: {},
    //       children: [word.node(context)],
    //     },
    //   );
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
    // .pushSpaceNode(null, lineModifiers, indentation1)
    // .setChildrenNodes([word])
    // .pushTokenNode(word, null, wordEnd)
    //   const context = c(this).newChild(this);
    //   return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
    //     kind: "leaf",
    //     print: true,
    //     shape: {
    //       spaces: {},
    //       separators: [],
    //     },
    //   });
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
  // node: {
  //   ...node,
  //   // ...nodeList,
  // },
  node,
  // creatorName,
  space,
  token,
  // separator: {
  //   ...separator,
  //   // ...separatorList,
  // },
};
