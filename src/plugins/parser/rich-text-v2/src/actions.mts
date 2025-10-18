import type * as ohm from "ohm-js";
import type { RankiLangAstContext, AstNodeLeaf } from "@ranki/package-api-v2";
import type {
  NodeArgRichTextV2SentenceEnd,
  NodeArgsRichTextV2,
  ParseNodeRichTextV2,
} from "./types.mjs";

import { zipNodes, joinNodes } from "@ranki/package-api-v2/helpers";

function wordEndArgs(context: RankiLangAstContext, wordEnd: ohm.Node) {
  return {
    "wordEnd.type": wordEnd.creatorName(context),
  };
}

function startToken(context: RankiLangAstContext, start: ohm.Node) {
  const startNodes: ParseNodeRichTextV2[] = start.iterNode(context);
  const startArgs: NodeArgsRichTextV2 = {};

  for (let si = 0; si < startNodes.length; si++) {
    const n = startNodes[si];
    if (n.kind !== "leaf") {
      throw new Error("DECORATION START IS NOT LEAF");
    }

    switch (n.type) {
      case "tRichTextV2DecorationEmphasis":
        if (!startArgs["em.start"]) {
          startArgs["em.start"] = { indices: [], level: 0 };
        }
        startArgs["em.start"].level++;
        startArgs["em.start"].indices.push(si);
        break;

      case "tRichTextV2DecorationBold":
        if (!startArgs["b.start"]) {
          startArgs["b.start"] = { indices: [], level: 0 };
        }
        startArgs["b.start"].level++;
        startArgs["b.start"].indices.push(si);
        break;

      case "tRichTextV2DecorationIdiomatic":
        if (!startArgs["i.start"]) {
          startArgs["i.start"] = { indices: [], level: 0 };
        }
        startArgs["i.start"].level++;
        startArgs["i.start"].indices.push(si);
        break;

      case "tRichTextV2DecorationUnderline":
        if (!startArgs["u.start"]) {
          startArgs["u.start"] = { indices: [], level: 0 };
        }
        startArgs["u.start"].level++;
        startArgs["u.start"].indices.push(si);
        break;

      case "tRichTextV2DecorationAbbreviation":
        if (!startArgs["abbreviation.start"]) {
          startArgs["abbreviation.start"] = {
            indices: [],
            level: 0,
          };
        }
        startArgs["abbreviation.start"].indices.push(si);
        startArgs["abbreviation.start"].level++;
        break;

      default:
        throw new Error(`UNRECOGNIZED START DECORATION ${n.type}`);
    }
  }
  return { startNodes, startArgs };
}

function endToken(context: RankiLangAstContext, end: ohm.Node) {
  const endNodes: AstNodeLeaf[] = end.iterNode(context);
  const endArgs: NodeArgsRichTextV2 = {};

  for (let ei = endNodes.length - 1; ei >= 0; ei--) {
    const n = endNodes[ei];
    if (n.kind !== "leaf") {
      throw new Error("DECORATION START IS NOT LEAF");
    }

    switch (n.type) {
      case "sentence":
        if (n.source.type !== "token") {
          throw new Error("VALUE MISMATCH: n.type ~ n.source.type");
        }
        const raw = n.source.raw;

        {
          type T = keyof NodeArgRichTextV2SentenceEnd["sentence.end"]["types"];
          if (!endArgs["sentence.end"]) {
            endArgs["sentence.end"] = {
              indices: [],
              level: 0,
              types: Object.keys(
                // @ts-expect-error
                context.hooks.getConfig().merged.plugins.config.RankiRichTextV2
                  .tokens.sentence,
              ).reduce((a, c) => {
                a[c as T] = false;
                return a;
              }, {} as Record<T, boolean>),
            };
          }
        }

        {
          type T = keyof NodeArgRichTextV2SentenceEnd["sentence.end"]["types"];
          endArgs["sentence.end"].indices.push(ei);
          endArgs["sentence.end"].level++;
          Object.entries(
            // @ts-expect-error
            context.hooks.getConfig().merged.plugins.config.RankiRichTextV2
              .tokens.sentence,
          ).forEach(([k, v]) => {
            endArgs["sentence.end"]!.types[k as T] ||= raw === v;
          });
        }
        break;

      case "tRichTextV2DecorationEmphasis":
        if (!endArgs["em.end"]) {
          endArgs["em.end"] = { indices: [], level: 0 };
        }
        endArgs["em.end"].level++;
        endArgs["em.end"].indices.push(ei);
        break;

      case "tRichTextV2DecorationBold":
        if (!endArgs["b.end"]) {
          endArgs["b.end"] = { indices: [], level: 0 };
        }
        endArgs["b.end"].level++;
        endArgs["b.end"].indices.push(ei);
        break;

      case "tRichTextV2DecorationIdiomatic":
        if (!endArgs["i.end"]) {
          endArgs["i.end"] = { indices: [], level: 0 };
        }
        endArgs["i.end"].level++;
        endArgs["i.end"].indices.push(ei);
        break;

      case "tRichTextV2DecorationUnderline":
        if (!endArgs["u.end"]) {
          endArgs["u.end"] = { indices: [], level: 0 };
        }
        endArgs["u.end"].level++;
        endArgs["u.end"].indices.push(ei);
        break;

      case "tRichTextV2DecorationAbbreviation":
        if (!endArgs["abbreviation.end"]) {
          endArgs["abbreviation.end"] = { indices: [], level: 0 };
        }
        endArgs["abbreviation.end"].indices.push(ei);
        endArgs["abbreviation.end"].level++;
        break;

      default:
        throw new Error(`UNRECOGNIZED  END DECORATION ${n.type}`);
    }
  }

  return { endNodes, endArgs };
}

const node: ohm.ActionDict<ParseNodeRichTextV2> = {
  textual(decorated1, clearance, decorated2) {
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
        separators: clearance.separator(context),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: zipNodes(context, decorated1, clearance, decorated2),
    };
  },

  decorated_decorated(start, word, end, wordEnd) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    const { startNodes, startArgs } = startToken(context, start);
    const { endNodes, endArgs } = endToken(context, end);

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
        separators: [],
        ...startArgs,
        ...endArgs,
        ...wordEndArgs(context, wordEnd),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: [...startNodes, word.node(context), ...endNodes],
    };
  },

  text_lowercase(text) {
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
        separators: [],
      },
      source: {
        type: "lowercase",
        raw: text.sourceString,
      },
    };
  },

  text_propercase(first, rest) {
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
        separators: [],
      },
      source: {
        type: "propercase",
        raw: first.sourceString + rest.sourceString,
      },
    };
  },

  text_uppercase(all) {
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
        separators: [],
      },
      source: {
        type: "uppercase",
        raw: all.sourceString,
      },
    };
  },

  text_mixedcaseUl(one, two, three, four) {
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
        separators: [],
      },
      source: {
        type: "mixedcase",
        raw: [one, two, three, four].map((v) => v.sourceString).join(""),
      },
    };
  },

  text_mixedcaseLu(one, two, three) {
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
        separators: [],
      },
      source: {
        type: "mixedcase",
        raw: [one, two, three].map((v) => v.sourceString).join(""),
      },
    };
  },

  tRichTextV2DecorationBold(b) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        separators: [],
      },
      source: {
        type: "token",
        raw: b.sourceString,
      },
    };
  },

  sentence(sentence) {
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
        separators: [],
      },
      source: {
        type: "token",
        raw: sentence.sourceString,
      },
    };
  },

  tRichTextV2DecorationAbbreviation(token) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        separators: [],
      },
      source: {
        type: "token",
        raw: token.sourceString,
      },
    };
  },

  tRichTextV2DecorationEmphasis(token) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        separators: [],
      },
      source: {
        type: "token",
        raw: token.sourceString,
      },
    };
  },

  tRichTextV2DecorationIdiomatic(token) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        separators: [],
      },
      source: {
        type: "token",
        raw: token.sourceString,
      },
    };
  },

  tRichTextV2DecorationUnderline(token) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.inlineDepth++;
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {},
        separators: [],
      },
      source: {
        type: "token",
        raw: token.sourceString,
      },
    };
  },

  /**
   * @overload
   */
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
        ...lineModifiers.lineModifiers(context),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: [lexemes.node(context)],
    };
  },

  word_punctuation(chars) {
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
        separators: [],
      },
      source: {
        type: "raw",
        raw: chars.sourceString,
      },
    };
  },

  decorated_richTextBase(start, word, end, wordEnd) {
    const parentContext: RankiLangAstContext = { ...this.args.context };
    parentContext.inlineDepth++;
    const leafContext: RankiLangAstContext = { ...parentContext };
    leafContext.inlineDepth++;
    const { startNodes, startArgs } = startToken(parentContext, start);
    const { endNodes, endArgs } = endToken(parentContext, end);

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
        separators: [],
        ...startArgs,
        ...endArgs,
        ...wordEndArgs(parentContext, wordEnd),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: [
        ...startNodes,
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
            type: "raw",
            raw: word.sourceString,
          },
        },
        ...endNodes,
      ],
    };
  },
};

const lineModifiers: ohm.ActionDict<NodeArgsRichTextV2> = {
  lineModifiers(alignment, smalltext, heading) {
    const context: RankiLangAstContext = { ...this.args.context };
    return {
      ...alignment.lineModifiers(context),
      ...smalltext.lineModifiers(context),
      ...heading.lineModifiers(context),
    };
  },

  smalltext_normal() {
    return {
      "line.smalltext": {
        type: this.ctorName,
        level: 0,
        clearance: 0,
      },
    };
  },

  smalltext_small(small, clearance) {
    return {
      "line.smalltext": {
        type: this.ctorName,
        level: small.sourceString.length,
        clearance: clearance.sourceString.length,
      },
    };
  },

  alignment_unaligned() {
    return {
      "line.alignment": {
        type: this.ctorName,
        level: 0,
        clearance: 0,
      },
    };
  },

  alignment_aligned(align, clearance) {
    return {
      "line.alignment": {
        type: this.ctorName,
        level: align.sourceString.length,
        clearance: clearance.sourceString.length,
      },
    };
  },

  heading_heading(heading, clearance) {
    return {
      "line.heading": {
        type: this.ctorName,
        level: heading.sourceString.length,
        clearance: clearance.sourceString.length,
      },
    };
  },

  heading_normal() {
    return {
      "line.heading": {
        type: this.ctorName,
        level: 0,
        clearance: 0,
      },
    };
  },
};

export const actions = {
  node,
  lineModifiers,
};
