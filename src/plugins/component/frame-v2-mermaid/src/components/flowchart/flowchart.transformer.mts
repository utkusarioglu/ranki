import type { ComponentPluginTransformFunc } from "@ranki/package-api-v2";
import {
  assertValidationParent,
  assertValidationSingleChild,
} from "@ranki/package-api-v2/helpers";
import {
  v2_fpCommon,
  // pausedContainer,
  // v2PayloadSection,
  frameV2CommonTransforms,
} from "@ranki/plugin-parser-frame-v2/transformers";

const v2PayloadPlain: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  assertValidationSingleChild(v);
  return v.context.newTransformNode(v, [
    {
      kind: "leaf",
      tag: ["graphing", "mermaid", "block", "section"].join("."),
      hoist: 0,
      params: v.plugins.transformer.params,
      // TODO this needs to access the child because the `PayloadPlain` parent
      // doesn't have the prefix and suffix yet merged into the content
      source: v.children[0].source,
    },
  ]);
};

const v2_fp: ComponentPluginTransformFunc = (v) => {
  const children = v2_fpCommon(v);
  return v.context.newTransformNode(v, [
    {
      tag: ["graphing", "mermaid", "block", "container"].join("."),
      kind: "parent",
      hoist: 0,
      children,
    },
  ]);
};

export const transformList = {
  ...frameV2CommonTransforms,
  v2_fp,
  // pausedContainer,
  v2PayloadPlain,
  // v2PayloadSection,
};
