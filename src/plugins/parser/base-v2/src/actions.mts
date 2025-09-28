import type * as ohm from "ohm-js";
import type { ParseContext, ParseNode } from "@ranki/package-api";
import { zipNodes, joinNodes } from "@ranki/package-api/helpers";

const node: ohm.ActionDict<ParseNode> = {
  root_ignore(indentation, directive, clearance, ignore, wm, rest) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {
        "indentation.1.length": indentation.sourceString.length,
        "clearance.1.length": clearance.sourceString.length,
        "wm.1.length": wm.sourceString.length,
      },
      // args2: [
      //   {
      //     key: "indentation.1.length",
      //     value: indentation.sourceString.length,
      //   },
      //   {
      //     key: "clearance.1.length",
      //     value: clearance.sourceString.length,
      //   },
      //   {
      //     key: "wm.1.length",
      //     value: wm.sourceString.length,
      //   },
      //   // more here
      // ],
      source: {
        type: "mixed",
        value: rest.sourceString,
      },
    };
  },

  section_empty(all) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      // args: {
      //   "indentation.1.length": indentation.sourceString.length,
      //   "clearance.1.length": clearance.sourceString.length,
      //   "wm.1.length": wm.sourceString.length,
      // },
      // args2: [
      //   {
      //     key: "indentation.1.length",
      //     value: indentation.sourceString.length,
      //   },
      //   {
      //     key: "clearance.1.length",
      //     value: clearance.sourceString.length,
      //   },
      //   {
      //     key: "wm.1.length",
      //     value: wm.sourceString.length,
      //   },
      //   // more here
      // ],
      source: {
        type: "mixed",
        value: all.sourceString,
      },
    };
  },

  root_structure(whitespace1, structure, whitespace2) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "whitespace.1.length": whitespace1.sourceString.length,
        "whitespace.2.length": whitespace2.sourceString.length,
      },
      // args: [
      //   {
      //     key: "whitespace.1.length",
      //     value: whitespace1.sourceString.length,
      //   },
      //   {
      //     key: "whitespace.2.length",
      //     value: whitespace2.sourceString.length,
      //   },
      // ],
      children: structure.node(this.args.context),
    };
  },

  section_base(block, blockSep, block2) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        // block sep lengths
      },
      children: joinNodes(this.args.context, block, block2),
    };
  },

  p(line1, nl, line2) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        // nl length
      },
      children: joinNodes(this.args.context, line1, line2),
    };
  },

  line(indentation1, lineModifiers, lexemes, wi1) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "indentation.1.length": indentation1.sourceString.length,
        "wi.1.length": wi1.sourceString.length,
      },
      children: [lexemes.node(this.args.context)],
    };
  },

  lexemes(lexeme1, clearance, lexeme2) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {},
      children: zipNodes(this.args.context, lexeme1, clearance, lexeme2),
      // children: zipNodes(this.args.context, lexeme1, clearance, lexeme2),
    };
  },

  decorated_base(word, wordEnd) {
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        "wordEnd.type": wordEnd.creatorName(this.args.context),
      },

      children: [word.node(this.args.context)],
    };
  },

  decorated_fallback(word, wordEnd) {
    return {
      kind: "parent",
      type: this.ctorName,
      // args: {},
      args: {
        "wordEnd.type": wordEnd.creatorName(this.args.context),
      },

      children: [
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
      ],
    };
  },

  word_base(base) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "mixed",
        value: base.sourceString,
      },
    };
  },

  word_number(number) {
    return {
      kind: "leaf",
      type: this.ctorName,
      print: true,
      args: {},
      source: {
        type: "number",
        raw: number.sourceString,
        number: +number.sourceString,
      },
    };
  },

  clearance(clearance1) {
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {
        "clearance.1.length": clearance1.sourceString.length,
      },
      source: {
        type: "text",
        value: clearance1.sourceString,
      },
    };
  },

  whitespace(wm, wi) {
    const sourceString = wm.sourceString + wi.sourceString;
    return {
      kind: "leaf",
      print: true,
      type: this.ctorName,
      args: {
        "whitespace.1.length": sourceString.length,
      },
      source: {
        type: "text",
        value: sourceString,
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
  sepRight(sep) {
    const context: ParseContext = this.args.context;
    const separators = context.config.merged.tokens.paramsV2.separator;
    return sep.sourceString === separators.right ? this.ctorName : "none";
  },
  sepLeft(sep) {
    const context: ParseContext = this.args.context;
    const separators = context.config.merged.tokens.paramsV2.separator;
    return sep.sourceString === separators.left ? this.ctorName : "none";
  },
};

const iterNode: ohm.ActionDict<ParseNode[]> = {
  _iter(...children) {
    return children.map((c) => c.node(this.args.context));
  },
};

export const actions = {
  node,
  creatorName,
  iterNode,
};
