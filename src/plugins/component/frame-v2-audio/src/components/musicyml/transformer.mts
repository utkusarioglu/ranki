import type { ComponentPluginTransformFunc } from "@ranki/package-api-v2";
import {
  assertValidationParent,
  assertValidationSingleChild,
} from "@ranki/package-api-v2/helpers";
import {
  v2_fpCommon,
  frameV2CommonTransforms,
} from "@ranki/plugin-parser-frame-v2/transformers";

const common = ["music", "score", "osmd", "musicxml", "yml"];

const v2PayloadPlain: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  assertValidationSingleChild(v);
  // TODO this needs to access the child because the `PayloadPlain` parent
  // doesn't have the prefix and suffix yet merged into the content
  return v.context.newTransformNode(v, [
    {
      kind: "leaf",
      tag: [...common, "section", v.shape.direction].join("."),
      hoist: 0,
      params: v.plugins.transformer.params,
      source: v.children[0].source,
    },
  ]);
};

const v2_fp: ComponentPluginTransformFunc = (v) => {
  const children = v2_fpCommon(v);
  const code = v.context.newTransformNode(v, [
    {
      tag: [...common, "container", v.shape.direction].join("."),
      kind: "parent",
      hoist: 0,
      children,
    },
  ]);
  return code;
};

export const transformList = {
  ...frameV2CommonTransforms,
  v2_fp,
  v2PayloadPlain,
};
