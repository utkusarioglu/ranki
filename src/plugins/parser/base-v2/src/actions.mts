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
        // "indentation.1.length": indentation.sourceString.length,
        // "clearance.1.length": clearance.sourceString.length,
        "wm.1.length": wm.sourceString.length,
      },
      source: {
        type: "mixed",
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
      },
      source: {
        type: "mixed",
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
        "whitespace.1.length": whitespace1.sourceString.length,
        "whitespace.2.length": whitespace2.sourceString.length,
      },
      children: [structure.node(context)],
    };
  },

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
        // block sep lengths
      },
      children: joinNodes(context, block, block2),
    };
  },

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
        // nl length
      },
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
        "indentation.1.length": indentation1.sourceString.length,
        "wi.1.length": wi1.sourceString.length,
      },
      children: [lexemes.node(context)],
    };
  },

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
      },
      children: zipNodes(context, lexeme1, clearance, lexeme2),
      // children: zipNodes(this.args.context, lexeme1, clearance, lexeme2),
    };
  },

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
        "wordEnd.type": wordEnd.creatorName(context),
      },

      children: [word.node(context)],
    };
  },

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
        "wordEnd.type": wordEnd.creatorName(this.args.context),
      },

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
          },
          source: {
            type: "mixed",
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
      },
      source: {
        type: "mixed",
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
      },
      source: {
        type: "number",
        raw: number.sourceString,
        number: +number.sourceString,
      },
    };
  },

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
        "clearance.1.length": clearance1.sourceString.length,
      },
      source: {
        type: "text",
        raw: clearance1.sourceString,
      },
    };
  },

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
        "whitespace.1.length": sourceString.length,
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
  // tParamsV2SeparatorFrame(sep) {
  //   const context: RankiLangAstContext = this.args.context;
  //   const separators =
  //     // @ts-expect-error
  //     context.lang.getConfig().merged.plugins.config.RankiParamsV2.tokens
  //       .separator;
  //   return sep.sourceString === separators.frame ? this.ctorName : "none";
  // },
  // tParamsV2SeparatorParam(sep) {
  //   const context: RankiLangAstContext = this.args.context;
  //   const separators =
  //     // @ts-expect-error
  //     context.lang.getConfig().merged.plugins.config.RankiParamsV2.tokens
  //       .separator;
  //   return sep.sourceString === separators.param ? this.ctorName : "none";
  // },
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
