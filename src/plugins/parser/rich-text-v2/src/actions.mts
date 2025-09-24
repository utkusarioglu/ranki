import type * as ohm from "ohm-js";
import type {
  ParseNode as ParseNodeBaseV2,
  NodeArgs as NodeArgsBaseV2,
  ParseContext,
  ParseNodeLeaf,
} from "@ranki/package-api";
import type { NodeArgSentenceEnd, NodeArgWordDecoration } from "./types.mjs";

type NodeArgs = Partial<NodeArgsBaseV2> & Partial<NodeArgWordDecoration>;

type ParseNode = Omit<ParseNodeBaseV2, "args"> & {
  args: NodeArgs;
};

import { zipNodes, joinNodes } from "@ranki/package-api/helpers";

function wordEndArgs(context: ParseContext, wordEnd: ohm.Node) {
  return {
    "wordEnd.type": wordEnd.creatorName(context),
  };
}

function startToken(context: ParseContext, start: ohm.Node) {
  const startNodes: ParseNode[] = start.iterNode(context);
  const startArgs: NodeArgs = {};

  for (let si = 0; si < startNodes.length; si++) {
    const n = startNodes[si];
    if (n.kind !== "leaf") {
      throw new Error("DECORATION START IS NOT LEAF");
    }

    switch (n.type) {
      case "em":
        // if (!startArgs.hasOwnProperty("em.start")) {
        if (!startArgs["em.start"]) {
          startArgs["em.start"] = { indices: [], level: 0 };
        }
        startArgs["em.start"].level++;
        startArgs["em.start"].indices.push(si);
        break;

      case "b":
        if (!startArgs["b.start"]) {
          startArgs["b.start"] = { indices: [], level: 0 };
        }
        startArgs["b.start"].level++;
        startArgs["b.start"].indices.push(si);
        break;

      case "i":
        if (!startArgs["i.start"]) {
          startArgs["i.start"] = { indices: [], level: 0 };
        }
        startArgs["i.start"].level++;
        startArgs["i.start"].indices.push(si);
        break;

      case "u":
        if (!startArgs["u.start"]) {
          startArgs["u.start"] = { indices: [], level: 0 };
        }
        startArgs["u.start"].level++;
        startArgs["u.start"].indices.push(si);
        break;

      case "abbr":
        if (!startArgs["abbreviation.start"]) {
          startArgs["abbreviation.start"] = {
            indices: [],
            level: 0,
          };
        }
        startArgs["abbreviation.start"].indices.push(si);
        startArgs["abbreviation.start"].level++;
        break;
    }
  }
  return { startNodes, startArgs };
}

function endToken(context: ParseContext, end: ohm.Node) {
  const endNodes: ParseNodeLeaf[] = end.iterNode(context);

  const endArgs: NodeArgs = {};

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
        const value = n.source.value;

        {
          type T = keyof NodeArgSentenceEnd["sentence.end"]["types"];
          if (!endArgs["sentence.end"]) {
            endArgs["sentence.end"] = {
              indices: [],
              level: 0,
              types: Object.keys(context.tokens.sentence).reduce((a, c) => {
                a[c as T] = false;
                return a;
              }, {} as Record<T, boolean>),
            };
          }
        }

        {
          type T = keyof NodeArgSentenceEnd["sentence.end"]["types"];
          endArgs["sentence.end"].indices.push(ei);
          endArgs["sentence.end"].level++;
          Object.entries(context.tokens.sentence).forEach(([k, v]) => {
            endArgs["sentence.end"]!.types[k as T] ||= value === v;
          });
        }
        break;

      case "em":
        if (!endArgs["em.end"]) {
          endArgs["em.end"] = { indices: [], level: 0 };
        }
        endArgs["em.end"].level++;
        endArgs["em.end"].indices.push(ei);
        break;

      case "b":
        if (!endArgs["b.end"]) {
          endArgs["b.end"] = { indices: [], level: 0 };
        }
        endArgs["b.end"].level++;
        endArgs["b.end"].indices.push(ei);
        break;

      case "i":
        if (!endArgs["i.end"]) {
          endArgs["i.end"] = { indices: [], level: 0 };
        }
        endArgs["i.end"].level++;
        endArgs["i.end"].indices.push(ei);
        break;

      case "u":
        if (!endArgs["u.end"]) {
          endArgs["u.end"] = { indices: [], level: 0 };
        }
        endArgs["u.end"].level++;
        endArgs["u.end"].indices.push(ei);
        break;

      case "abbr":
        if (!endArgs["abbreviation.end"]) {
          endArgs["abbreviation.end"] = { indices: [], level: 0 };
        }
        endArgs["abbreviation.end"].indices.push(ei);
        endArgs["abbreviation.end"].level++;
        break;
    }
  }

  return { endNodes, endArgs };
}

const node: ohm.ActionDict<ParseNode> = {
  textual(decorated1, clearance, decorated2) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {},
      children: zipNodes(this.args.context, decorated1, clearance, decorated2),
    };
  },

  decorated_decorated(start, word, end, wordEnd) {
    const { startNodes, startArgs } = startToken(this.args.context, start);
    const { endNodes, endArgs } = endToken(this.args.context, end);

    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        ...startArgs,
        ...endArgs,
        ...wordEndArgs(this.args.context, wordEnd),
      },
      children: [...startNodes, word.node(this.args.context), ...endNodes],
    };
  },

  text_lowercase(text) {
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {},
      source: {
        type: "lowercase",
        value: text.sourceString,
      },
    };
  },

  text_propercase(first, rest) {
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {},
      source: {
        type: "propercase",
        value: first.sourceString + rest.sourceString,
      },
    };
  },

  text_uppercase(all) {
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {},
      source: {
        type: "uppercase",
        value: all.sourceString,
      },
    };
  },

  text_mixedcaseUl(one, two, three, four) {
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {},
      source: {
        type: "mixedcase",
        value: [one, two, three, four].map((v) => v.sourceString).join(""),
      },
    };
  },

  text_mixedcaseLu(one, two, three) {
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {},
      source: {
        type: "mixedcase",
        value: [one, two, three].map((v) => v.sourceString).join(""),
      },
    };
  },

  b(b) {
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {},
      source: {
        type: "token",
        value: b.sourceString,
      },
    };
  },

  sentence(sentence) {
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {},
      source: {
        type: "token",
        value: sentence.sourceString,
      },
    };
  },

  abbr(abbr) {
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {},
      source: {
        type: "token",
        value: abbr.sourceString,
      },
    };
  },

  em(abbr) {
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {},
      source: {
        type: "token",
        value: abbr.sourceString,
      },
    };
  },

  i(abbr) {
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {},
      source: {
        type: "token",
        value: abbr.sourceString,
      },
    };
  },

  u(abbr) {
    return {
      kind: "leaf",
      print: false,
      type: this.ctorName,
      args: {},
      source: {
        type: "token",
        value: abbr.sourceString,
      },
    };
  },

  // override
  line(indentation1, lineModifiers, lexemes, wi1) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "indentation.1.length": indentation1.sourceString.length,
        "wi.1.length": wi1.sourceString.length,
        ...lineModifiers.lineModifiers(this.args.context),
      },
      children: lexemes.node(this.args.context),
    };
  },

  word_punctuation(chars) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "mixed",
        value: chars.sourceString,
      },
    };
  },

  decorated_richTextBase(start, word, end, wordEnd) {
    const { startNodes, startArgs } = startToken(this.args.context, start);
    const { endNodes, endArgs } = endToken(this.args.context, end);

    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        ...startArgs,
        ...endArgs,
        ...wordEndArgs(this.args.context, wordEnd),
      },
      children: [
        ...startNodes,
        {
          kind: "leaf",
          type: this.ctorName,
          print: true,
          args: {},
          source: {
            type: "mixed",
            value: word.sourceString,
          },
        },
        ...endNodes,
      ],
    };
  },
};

const lineModifiers: ohm.ActionDict<NodeArgs> = {
  lineModifiers(alignment, smalltext, heading) {
    return {
      ...alignment.lineModifiers(this.args.context),
      ...smalltext.lineModifiers(this.args.context),
      ...heading.lineModifiers(this.args.context),
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
