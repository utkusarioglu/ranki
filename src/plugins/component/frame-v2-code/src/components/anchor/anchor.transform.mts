import type { ComponentPluginTransformFunc } from "@ranki/package-api-v2";
import {
  assertValidationParent,
  assertValidationSingleChild,
} from "@ranki/package-api-v2/helpers";
import {
  v2_fpCommon,
  pausedContainer,
  v2PayloadSection,
} from "@ranki/plugin-parser-frame-v2/transformers";

const v2PayloadPlain: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  assertValidationSingleChild(v);
  return v.context.newTransformNode(v, [
    {
      kind: "leaf",
      // tag: "html.primitive.anchor.basic.section",
      tag: "span",
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
      tag: "html.primitive.anchor.basic.container",
      kind: "parent",
      hoist: 0,
      children,
    },
  ]);
  return code;
};

export const transformList = {
  v2_fp,
  pausedContainer,
  v2PayloadPlain,
  v2PayloadSection,
};
