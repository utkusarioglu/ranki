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
      tag: ["frame", "v2", "math", "latex", "block", "section"].join("."),
      hoist: 0,
      params: v.plugins.transformer.params,
      source: {
        type: "raw",
        raw: v.source.raw,
      },
    },
  ]);
};

// const v2PayloadSection: ComponentPluginTransformFunc = (v) => {
//   assertValidationParent(v);
//   const all = v.context.parseTransform(v.children);
//   assertTransformExists(all);
//   return v.context.newTransformNode(v, all);
// };

// const pausedContainer: ComponentPluginTransformFunc = (v) => {
//   assertValidationParent(v);
//   const children = v.context.parseTransform(v.children);
//   assertTransformExists(children);
//   children.forEach((t) => {
//     t.hoist = v.shape.hoist;
//   });
//   const end = v.context.newTransformNode(v, children);
//   return end;
// };

const v2_fp: ComponentPluginTransformFunc = (v) => {
  const children = v2_fpCommon(v);

  const code = v.context.newTransformNode(v, [
    {
      tag: ["frame", "v2", "math", "latex", "block", "container"].join("."),
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
