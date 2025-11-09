import type {
  ValidationNodeParent,
  ComponentPluginTransformFunc,
  ValidationNodeLeaf,
} from "@ranki/package-api-v2";
import { assertValidationParent } from "@ranki/package-api-v2/helpers";

export const anchor: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);

  const payload = v.children[0];
  const pauseList = (payload as ValidationNodeParent).children[0];

  const payloadSection = (pauseList as ValidationNodeParent).children[0];
  const payloadPlain = (payloadSection as ValidationNodeParent).children[0];
  const rootIgnore = (payloadPlain as ValidationNodeParent)
    .children[0] as ValidationNodeLeaf;

  // !FIX trimming may not be a good idea
  const raw = rootIgnore.source.raw.trim();

  const all = [
    {
      tag: "html.primitive.anchor.basic",
      kind: "leaf" as "leaf",
      // print: true,
      hoist: 0,
      // creator: v.creator,
      // depth: v.shape.depth.total,
      // params: "hi",
      source: {
        type: "raw" as "raw",
        raw: [
          raw[0].toUpperCase(),
          raw.slice(1).toLocaleLowerCase(),
          // validation.source.raw[0].toUpperCase(),
          // validation.source.raw.slice(1).toLocaleLowerCase(),
        ].join(""),
      },
    },
  ];
  return v.context.newTransformNode(v, all);
};
