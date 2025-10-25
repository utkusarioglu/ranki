import type * as ohm from "ohm-js";
import type {
  AstNode,
  SeparatorEntry,
  RankiLangContextInstance as R,
} from "@ranki/package-api-v2";
import { zipNodes, joinNodes } from "@ranki/package-api-v2/helpers";

const separatorList: ohm.ActionDict<SeparatorEntry[]> = {
  _iter(...children) {
    return children.map((c) => c.separator(this.args.context));
  },
};

const separator: ohm.ActionDict<SeparatorEntry> = {
  blockSep_base(n1, wi1, nl, wi) {
    return {
      type: "block",
      raw: this.sourceString,
    };
  },
  clearance(all) {
    return {
      type: "clearance",
      raw: this.sourceString,
    };
  },
  nl(all) {
    return {
      type: "nl",
      raw: this.sourceString,
    };
  },
  whitespace(one, two) {
    return {
      type: "whitespace",
      raw: this.sourceString,
    };
  },
};

const node: ohm.ActionDict<AstNode> = {
  root_ignore(ignore, wm, rest) {
    const context = (this.args.context as R).newNode("block");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
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
    };
  },

  section_empty(all) {
    const context = (this.args.context as R).newNode("block");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
      source: {
        type: "raw",
        raw: all.sourceString,
      },
    };
  },

  root_structure(whitespace1, structure, whitespace2) {
    const context = (this.args.context as R).newNode("block");
    return {
      kind: "parent",
      creator: this.ctorName,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
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
      subtree: {},
      children: [structure.node(context)],
    };
  },

  section_base(block, blockSep, block2) {
    const context = (this.args.context as R).newNode("block");
    return {
      kind: "parent",
      creator: this.ctorName,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: blockSep.separator(context),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
      children: joinNodes(context, block, block2),
    };
  },

  // TODO nl
  p(line1, nl, line2) {
    const context = (this.args.context as R).newNode("block");
    return {
      kind: "parent",
      creator: this.ctorName,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: nl.separator(context),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
      children: joinNodes(context, line1, line2),
    };
  },

  // TODO line modifiers
  line(indentation1, lineModifiers, lexemes, wi1) {
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "parent",
      creator: this.ctorName,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
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
      subtree: {},
      children: [lexemes.node(context)],
    };
  },

  // TODO clearance
  lexemes(lexeme1, clearance, lexeme2) {
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "parent",
      creator: this.ctorName,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: clearance.separator(context),
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {},
      children: joinNodes(context, lexeme1, lexeme2),
    };
  },

  decorated_base(word, wordEnd) {
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "parent",
      creator: this.ctorName,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
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
      subtree: {},
      children: [word.node(context)],
    };
  },

  decorated_fallback(word, wordEnd) {
    const parentContext = (this.args.context as R).newNode("inline");
    const leafContext = (parentContext as R).newNode("inline");
    return {
      kind: "parent",
      creator: this.ctorName,
      parser: { hash: parentContext.getHash("ast") },
      args: {
        ...parentContext.getContextArgs(),
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
      subtree: {},
      children: [
        {
          kind: "leaf",
          creator: this.ctorName,
          print: true,
          parser: { hash: leafContext.getHash("ast") },
          args: {
            ...leafContext.getContextArgs(),
            spaces: {},
            separators: [],
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
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
      source: {
        type: "raw",
        raw: base.sourceString,
      },
    };
  },

  word_number(number) {
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "leaf",
      creator: this.ctorName,
      print: true,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
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
    const context = (this.args.context as R).newNode("inline");
    return {
      kind: "leaf",
      print: true,
      creator: this.ctorName,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
      },
      source: {
        type: "text",
        raw: clearance1.sourceString,
      },
    };
  },

  // TODO should this exist?
  whitespace(wm, wi) {
    const context = (this.args.context as R).newNode("inline");
    const sourceString = wm.sourceString + wi.sourceString;
    return {
      kind: "leaf",
      print: true,
      creator: this.ctorName,
      parser: { hash: context.getHash("ast") },
      args: {
        ...context.getContextArgs(),
        spaces: {},
        separators: [],
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
  separator: {
    ...separator,
    ...separatorList,
  },
};
