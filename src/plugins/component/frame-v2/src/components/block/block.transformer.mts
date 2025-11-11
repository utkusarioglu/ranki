import type {
  ComponentPluginTransformFunc,
  // TransformNode,
} from "@ranki/package-api-v2";
import {
  assertTransformExists,
  assertValidationParent,
  // createTransformer,
} from "@ranki/package-api-v2/helpers";

export const block_v2: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  // const children = transform.list(v.children);
  // const children: TransformNode[] = [];

  // v.children.forEach((c) => {
  //   children.push(...transform(c));
  // });

  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);
  return children;
};

export const transformList = {
  block_v2,
};

// export const transform = createTransformer(
//   // ! THIS IS DEFINED TWICE, which means this function should become a private method for the component library
//   ["frame", "v2", "block"],
//   {},
// );
