import type * as ohm from "ohm-js";
import type { ParseNode } from "./types.mjs";

export const basicAction: ohm.ActionDict<ParseNode> = {
  document_blocks(whitespace1, blocks, whitespace2) {
    return {
      kind: "leaf",
      type: "ignore",
      args: [
        {
          key: "PRE_WHITESPACE",
          value: whitespace1.sourceString.length,
        },
        {
          key: "POST_WHITESPACE",
          value: whitespace2.sourceString.length,
        },
      ],
      source: {
        type: "mixed",
        value: blocks.sourceString,
      },
      // others: [indentation, directive, clearance, ignore, wm].map(
      //   (v) => v.sourceString,
      // ),
      // contentTrimmed: rest.sourceString.trim(),
      // content: rest.sourceString,
      // children:
    };
  },
};
