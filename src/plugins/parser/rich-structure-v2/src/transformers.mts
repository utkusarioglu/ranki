import type {
  RankiPluginParserTransformCallback,
  RankiPluginParserTransformFunc,
  ValidationNode,
} from "@ranki/package-api-v2";

const placeholder: RankiPluginParserTransformFunc = (v: ValidationNode) => {
  switch (v.kind) {
    case "parent":
      return {
        kind: "parent",
        tag: "div",
        children: [],
      };
    case "leaf":
      return {
        kind: "leaf",
        tag: "span",
      };
    default:
      // @ts-expect-error
      throw new Error(`UNRECOGNIZED VALIDATION NODE TYPE: ${v.kind}`);
  }
};

export const transformers: RankiPluginParserTransformCallback = () => ({});
