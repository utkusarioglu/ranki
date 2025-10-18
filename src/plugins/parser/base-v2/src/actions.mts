import type * as ohm from "ohm-js";
import type { RankiLangAstContext, AstNode } from "@ranki/package-api-v2";
import { zipNodes, joinNodes } from "@ranki/package-api-v2/helpers";

const node: ohm.ActionDict<AstNode> = {
  root_ignore(ignore, wm, rest) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {
          ignoreAndRest: {
            type: "wm",
            raw: wm.sourceString,
          },
        },
      },
      source: {
        type: "raw",
        raw: rest.sourceString,
      },
    };
  },

  section_empty(all) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
      },
      source: {
        type: "raw",
        raw: all.sourceString,
      },
    };
  },

  root_structure(whitespace1, structure, whitespace2) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
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
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: [structure.node(context)],
    };
  },

  // TODO blockSep
  section_base(block, blockSep, block2) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: joinNodes(context, block, block2),
    };
  },

  // TODO nl
  p(line1, nl, line2) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        // nl length
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: joinNodes(context, line1, line2),
    };
  },

  line(indentation1, lineModifiers, lexemes, wi1) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
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
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: [lexemes.node(context)],
    };
  },

  // TODO clearance
  lexemes(lexeme1, clearance, lexeme2) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: zipNodes(context, lexeme1, clearance, lexeme2),
    };
  },

  // TODO wordEnd
  decorated_base(word, wordEnd) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        "wordEnd.type": wordEnd.creatorName(context),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: [word.node(context)],
    };
  },

  // TODO wordEnd
  decorated_fallback(word, wordEnd) {
    const parentContext: RankiLangAstContext = { ...this.args.context };
    parentContext.inlineDepth++;
    const leafContext: RankiLangAstContext = { ...parentContext };
    leafContext.inlineDepth++;
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: parentContext.blockDepth,
          inline: parentContext.inlineDepth,
          total: parentContext.inlineDepth + parentContext.blockDepth,
        },
        spaces: {},
        "wordEnd.type": wordEnd.creatorName(this.args.context),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: [
        {
          kind: "leaf",
          type: this.ctorName,
          print: true,
          args: {
            depth: {
              block: leafContext.blockDepth,
              inline: leafContext.inlineDepth,
              total: leafContext.inlineDepth + leafContext.blockDepth,
            },
            spaces: {},
          },
          source: {
            type: "raw",
            raw: word.sourceString,
          },
        },
      ],
    };
  },

  word_base(base) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
      },
      source: {
        type: "raw",
        raw: base.sourceString,
      },
    };
  },

  word_number(number) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
      },
      source: {
        type: "number",
        raw: number.sourceString,
        number: +number.sourceString,
      },
    };
  },

  // TODO should this exist?
  clearance(clearance1) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        // "clearance.1.length": clearance1.sourceString.length,
      },
      source: {
        type: "text",
        raw: clearance1.sourceString,
      },
    };
  },

  // TODO should this exist?
  whitespace(wm, wi) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    const sourceString = wm.sourceString + wi.sourceString;
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        // "whitespace.1.length": sourceString.length,
      },
      source: {
        type: "text",
        raw: sourceString,
      },
    };
  },
};
const creatorName: ohm.ActionDict<string> = {
  nl(nl) {
    return this.ctorName;
  },
  end(end) {
    return this.ctorName;
  },
  clearance(clearance1) {
    return this.ctorName;
  },
};

const iterNode: ohm.ActionDict<AstNode[]> = {
  _iter(...children) {
    return children.map((c) => c.node(this.args.context));
  },
};

export const actions = {
  node,
  creatorName,
  iterNode,
};
