import type * as ohm from "ohm-js";
import type {
  AstNode,
  SeparatorEntry,
  RankiLangContextInstance as R,
} from "@ranki/package-api-v2";
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
    const context = c(this).newChild("block");
    return context.enrich<BaseV2NodeLeafReduced, BaseV2Node>({
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      shape: {
        spaces: {
          ignoreAndRest: {
            type: "wm",
            raw: wm.sourceString,
          },
        },
        separators: [],
      },
      source: {
        type: "raw",
        raw: rest.sourceString,
      },
    });
  },

  section_empty(all) {
    const context = c(this).newChild("block");

    return context.enrich<BaseV2NodeLeafReduced, BaseV2Node>({
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      shape: {
        spaces: {},
        separators: [],
      },
      source: {
        type: "raw",
        raw: all.sourceString,
      },
    });
  },

  root_structure(whitespace1, structure, whitespace2) {
    const context = c(this).newChild("block");
    return context.enrich<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        creator: this.ctorName,
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
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        children: [structure.node(context)],
        subtree: {},
      },
    );
  },

  section_base(block, blockSep, block2) {
    const context = c(this).newChild("block");
    return context.enrich<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        creator: this.ctorName,
        shape: {
          spaces: {},
          separators: blockSep.separator(context),
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        children: joinNodes(context, block, block2),
      },
    );
  },

  // TODO nl
  p(line1, nl, line2) {
    const context = c(this).newChild("block");
    return context.enrich<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        creator: this.ctorName,
        shape: {
          spaces: {},
          separators: nl.separator(context),
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: joinNodes(context, line1, line2),
      },
    );
  },

  // TODO line modifiers
  line(indentation1, _lineModifiers, lexemes, wi1) {
    const context = c(this).newChild("inline");
    return context.enrich<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        creator: this.ctorName,
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
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: [lexemes.node(context)],
      },
    );
  },

  // TODO clearance
  lexemes(lexeme1, clearance, lexeme2) {
    const context = c(this).newChild("inline");
    return context.enrich<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        creator: this.ctorName,
        shape: {
          spaces: {},
          separators: clearance.separator(context),
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: joinNodes(context, lexeme1, lexeme2),
      },
    );
  },

  decorated_base(word, wordEnd) {
    const context = c(this).newChild("inline");
    return context.enrich<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        creator: this.ctorName,
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
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: [word.node(context)],
      },
    );
  },

  decorated_fallback(word, wordEnd) {
    const parentContext = c(this).newChild("inline");
    return parentContext.enrich<BaseV2NodeParentReduced, BaseV2Node>(
      {
        kind: "parent",
        creator: this.ctorName,
        shape: {
          spaces: {
            suffix: {
              type: wordEnd.creatorName(parentContext),
              raw: wordEnd.sourceString,
            },
          },
          separators: [],
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {},
        children: [
          (() => {
            const leafContext = (parentContext as R).newChild("inline");
            return leafContext.enrich<BaseV2NodeLeafReduced, BaseV2Node>({
              kind: "leaf",
              creator: this.ctorName,
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

  word_base(base) {
    const context = c(this).newChild("inline");
    return context.enrich<BaseV2NodeLeafReduced, BaseV2Node>({
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      shape: {
        spaces: {},
        separators: [],
      },
      source: {
        type: "raw",
        raw: base.sourceString,
      },
    });
  },

  word_number(number) {
    const context = c(this).newChild("inline");
    return context.enrich<BaseV2NodeLeafReduced, BaseV2Node>({
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      shape: {
        spaces: {},
        separators: [],
      },
      source: {
        type: "number",
        raw: number.sourceString,
        number: +number.sourceString,
      },
    });
  },

  // TODO should this exist?
  clearance(clearance1) {
    const context = c(this).newChild("inline");
    return context.enrich<BaseV2NodeLeafReduced, BaseV2Node>({
      kind: "leaf",
      print: true,
      creator: this.ctorName,
      shape: {
        spaces: {},
        separators: [],
      },
      source: {
        type: "text",
        raw: clearance1.sourceString,
      },
    });
  },

  // TODO should this exist?
  whitespace(wm, wi) {
    const context = c(this).newChild("inline");
    const sourceString = wm.sourceString + wi.sourceString;
    return context.enrich<BaseV2NodeLeafReduced, BaseV2Node>({
      kind: "leaf",
      print: true,
      creator: this.ctorName,
      shape: {
        spaces: {},
        separators: [],
        // "whitespace.1.length": sourceString.length,
      },
      source: {
        type: "text",
        raw: sourceString,
      },
    });
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
