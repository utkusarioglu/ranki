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
        creator: v.type,
        children: [],
      };
    case "leaf":
      let value;
      switch (v.source.type) {
        case "number":
          value = v.source.number.toString();
          break;
        default:
          value = v.source.value;
      }
      return {
        kind: "leaf",
        creator: v.type,
        depth: v.args.depth.total,
        dataType: v.source.type,
        print: v.print,
        tag: "span",
        value,
      };
  }
};
