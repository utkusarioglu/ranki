import type { ValidationNode } from "../stages/validation.mjs";
import type { RankiPluginParserTransformFunc } from "../stages/transform.mjs";

export const transformPlaceholder: RankiPluginParserTransformFunc = (
  v: ValidationNode,
) => {
  switch (v.kind) {
    case "parent":
      return {
        kind: "parent",
        tag: "div",
        depth: v.args.depth.total,
        creator: v.creator,
        children: [],
      };
    case "leaf":
      return {
        kind: "leaf",
        tag: "span",
        creator: v.creator,
        depth: v.args.depth.total,
        print: v.print,
        source: v.source,
      };
  }
};
