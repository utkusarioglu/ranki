import type {
  // ValidationNodeParent,
  ComponentPluginTransformFunc,
  // ValidationNodeLeaf,
} from "@ranki/package-api-v2";
import { assertValidationParent } from "@ranki/package-api-v2/helpers";
import {
  v2_fpCommon,
  pausedContainer,
  v2PayloadSection,
} from "@ranki/plugin-parser-frame-v2/transformers";

// const v2_fp: ComponentPluginTransformFunc = (v) => {
//   assertValidationParent(v);

//   const payload = v.children[0];
//   const pauseList = (payload as ValidationNodeParent).children[0];

//   const payloadSection = (pauseList as ValidationNodeParent).children[0];
//   const payloadPlain = (payloadSection as ValidationNodeParent).children[0];
//   const rootIgnore = (payloadPlain as ValidationNodeParent)
//     .children[0] as ValidationNodeLeaf;

//   // !FIX trimming may not be a good idea
//   const raw = rootIgnore.source.raw.trim();

//   const all = [
//     {
//       tag: "html.primitive.anchor.basic",
//       kind: "leaf" as "leaf",
//       // print: true,
//       hoist: 0,
//       // creator: v.creator,
//       // depth: v.shape.depth.total,
//       // params: "hi",
//       source: {
//         type: "raw" as "raw",
//         raw: [
//           raw[0].toUpperCase(),
//           raw.slice(1).toLocaleLowerCase(),
//           // validation.source.raw[0].toUpperCase(),
//           // validation.source.raw.slice(1).toLocaleLowerCase(),
//         ].join(""),
//       },
//     },
//   ];
//   return v.context.newTransformNode(v, all);
// };

const v2PayloadPlain: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  return v.context.newTransformNode(v, [
    {
      kind: "leaf",
      // tag: "html.primitive.anchor.basic.section",
      tag: "span",
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
// export const transform = createTransformer(
//   ["frame", "v2", "navigation", "anchor"],
//   {
//     v2_fp,
//   },
// );
