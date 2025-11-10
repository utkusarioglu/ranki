import type { ComponentPluginTransformFunc } from "@ranki/package-api-v2";
import { assertValidationParent } from "@ranki/package-api-v2/helpers";
import {
  v2_fpCommon,
  pausedContainer,
  v2PayloadSection,
} from "@ranki/plugin-parser-frame-v2/transformers";

const v2PayloadPlain: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  return v.context.newTransformNode(v, [
    {
      kind: "leaf",
      tag: "computer_science.code.block.section",
      hoist: 0,
      params: v.plugins.transformer.params,
      source: {
        type: "raw",
        raw: v.source.raw,
      },
    },
  ]);
};

const v2_fp: ComponentPluginTransformFunc = (v) => {
  const children = v2_fpCommon(v);
  const code = v.context.newTransformNode(v, [
    {
      tag: "computer_science.code.block.container",
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
