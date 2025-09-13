import type * as ohm from "ohm-js";
import type { ParseNode } from "./types.mjs";

export const ignoreAction: ohm.ActionDict<ParseNode> = {
  document_ignore(indentation, directive, clearance, ignore, wm, rest) {
    return {
      kind: "leaf",
      type: "ignore",
      args: [],
      source: {
        type: "mixed",
        value: rest.sourceString,
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
