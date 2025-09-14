import type * as ohm from "ohm-js";
import type { ParseNode } from "../types.mjs";

export const baseAction: ohm.ActionDict<ParseNode> = {
  root_defined(whitespace1, sections, whitespace2) {
    return {
      kind: "leaf",
      type: "content",
      args: [],
      source: {
        type: "mixed",
        value: sections.sourceString,
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
