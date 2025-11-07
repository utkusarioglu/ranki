import type { ValidationNode } from "../stages/validation.type.mjs";
import type { RankiPluginParserTransformFunc } from "../stages/transform.type.mjs";

export const transformPlaceholder: RankiPluginParserTransformFunc = (
  v: ValidationNode,
) => {
  switch (v.kind) {
    case "parent":
      return {
        kind: "parent",
        tag: "div",
        hoist: 0,
        depth: v.shape.depth.total,
        creator: v.creator,
        children: [],
      };
    case "leaf":
      return {
        kind: "leaf",
        tag: "span",
        hoist: 0,
        creator: v.creator,
        depth: v.shape.depth.total,
        print: v.print,
        source: v.source,
      };
  }
};
