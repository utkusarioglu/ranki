import type * as ohm from "ohm-js";
import type { AstNode, SeparatorEntry } from "@ranki/package-api-v2";
import { getContext as c } from "@ranki/package-api-v2/helpers";
import { joinNodes } from "@ranki/package-api-v2/helpers";
import type {
  BaseV2Node,
  BaseV2NodeLeafReduced,
  BaseV2NodeParentReduced,
} from "./type.mjs";

const separatorList: ohm.ActionDict<SeparatorEntry[]> = {
  _iter(...children) {
    return children.map((ch) => ch.separator(c(this)));
  },
};

const separator: ohm.ActionDict<SeparatorEntry> = {
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

const node: ohm.ActionDict<BaseV2Node> = {
  root_ignore(_ignore, wm, rest) {
    const context = c(this).newChild(this, "block");
    return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        shape: {
          spaces: {
            ignoreAndRest: {
              type: "wm",
              raw: wm.sourceString,
            },
          },
          separators: [],
        },
      },
      {
        children: [
          (() => {
            const leafContext = context.newChild(this, "inline");
            return leafContext.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
              kind: "leaf",
              print: true,
              shape: {
                spaces: {},
                separators: [],
              },
              source: {
                type: "raw",
                raw: rest.sourceString,
              },
            });
          })(),
        ],
      },
    );
  },

  section_empty(_all) {
    const context = c(this).newChild(this, "block");

    return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
      kind: "leaf",
      print: true,
      shape: {
        spaces: {},
        separators: [],
      },
    });
  },

  root_structure(whitespace1, structure, whitespace2) {
    const context = c(this)
      .newComponentBoundary({
        handler: "RankiBaseV2",
        chain: ["base", "v2", "default"],
        params: [],
      })
      .newChild(this, "block");
    return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        shape: {
          spaces: {
            prefix: {
              type: "whitespace",
              raw: whitespace1.sourceString,
            },
            suffix: {
              type: "whitespace",
              raw: whitespace2.sourceString,
            },
          },
          separators: [],
        },
      },
      {
        children: [structure.node(context)],
      },
    );
  },

  section_base(block, blockSep, block2) {
    const context = c(this).newChild(this, "block");
    return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        shape: {
          spaces: {},
          separators: blockSep.separator(context),
        },
      },
      {
        children: joinNodes(context, block, block2),
      },
    );
  },

  // TODO nl
  p(line1, nl, line2) {
    const context = c(this).newChild(this, "block");
    return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        shape: {
          spaces: {},
          separators: nl.separator(context),
        },
      },
      {
        children: joinNodes(context, line1, line2),
      },
    );
  },

  // TODO line modifiers
  line(indentation1, _lineModifiers, lexemes, wi1) {
    const context = c(this).newChild(this, "inline");
    return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        shape: {
          spaces: {
            prefix: {
              type: "indentation",
              raw: indentation1.sourceString,
            },
            suffix: {
              type: "wi",
              raw: wi1.sourceString,
            },
          },
          separators: [],
        },
      },
      {
        children: [lexemes.node(context)],
      },
    );
  },

  // TODO clearance
  lexemes(lexeme1, clearance, lexeme2) {
    const context = c(this).newChild(this, "inline");
    return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        shape: {
          spaces: {},
          separators: clearance.separator(context),
        },
      },
      {
        subtree: {},
        children: joinNodes(context, lexeme1, lexeme2),
      },
    );
  },

  decorated_base(word, wordEnd) {
    const context = c(this).newChild(this, "inline");
    return context.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        shape: {
          spaces: {
            suffix: {
              // !fix this would return an `any` type
              type: wordEnd.creatorName(context),
              raw: wordEnd.sourceString,
            },
          },
          separators: [],
        },
      },
      {
        subtree: {},
        children: [word.node(context)],
      },
    );
  },

  decorated_fallback(word, wordEnd) {
    const parentContext = c(this).newChild(this, "inline");
    return parentContext.newAstNode<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        shape: {
          spaces: {
            suffix: {
              type: wordEnd.creatorName(parentContext),
              raw: wordEnd.sourceString,
            },
          },
          separators: [],
        },
      },
      {
        subtree: {},
        children: [
          (() => {
            const leafContext = parentContext.newChild(this, "inline");
            return leafContext.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
              kind: "leaf",
              print: true,
              shape: {
                spaces: {},
                separators: [],
              },
              source: {
                type: "raw",
                raw: word.sourceString,
              },
            });
          })(),
        ],
      },
    );
  },

  word_base(_base) {
    const context = c(this).newChild(this, "inline");
    return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
      kind: "leaf",
      print: true,
      shape: {
        spaces: {},
        separators: [],
      },
    });
  },

  word_number(_number) {
    const context = c(this).newChild(this, "inline");
    return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>({
      kind: "leaf",
      print: true,
      shape: {
        spaces: {},
        separators: [],
      },
      source: {
        type: "number",
        raw: this.sourceString,
        number: +this.sourceString,
      },
    });
  },

  // TODO should this exist?
  clearance(_clearance1) {
    const context = c(this).newChild(this, "inline");
    return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>(
      {
        kind: "leaf",
        print: true,
        shape: {
          spaces: {},
          separators: [],
        },
      },
      {
        sourceType: "text",
      },
    );
  },

  // TODO should this exist?
  whitespace(_wm, _wi) {
    const context = c(this).newChild(this, "inline");
    return context.newAstNode<BaseV2NodeLeafReduced, BaseV2Node>(
      {
        kind: "leaf",
        print: true,
        shape: {
          spaces: {},
          separators: [],
        },
      },
      {
        sourceType: "text",
      },
    );
  },
};

const creatorName: ohm.ActionDict<string> = {
  nl(_nl) {
    return this.ctorName;
  },
  end(_end) {
    return this.ctorName;
  },
  clearance(_clearance1) {
    return this.ctorName;
  },
};

const nodeList: ohm.ActionDict<AstNode[]> = {
  _iter(...children) {
    return children.map((ch) => ch.node(c(this)));
  },
};

export const actions = {
  node: {
    ...node,
    ...nodeList,
  },
  creatorName,
  separator: {
    ...separator,
    ...separatorList,
  },
};
