import type * as ohm from "ohm-js";
import type { ParseNode } from "./types.mjs";

export const richTextAction: ohm.ActionDict<ParseNode> = {
  // document_blocks(whitespace1, blocks, whitespace2) {
  //   return {
  //     kind: "leaf",
  //     type: "ignore",
  //     args: [],
  //     source: {
  //       type: "mixed",
  //       value: "rich " + blocks.sourceString,
  //     },
  //     // others: [indentation, directive, clearance, ignore, wm].map(
  //     //   (v) => v.sourceString,
  //     // ),
  //     // contentTrimmed: rest.sourceString.trim(),
  //     // content: rest.sourceString,
  //     // children:
  //   };
  // },
};
