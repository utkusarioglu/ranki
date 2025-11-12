import type { ComponentPluginTransformFunc } from "@ranki/package-api-v2";
import {
  assertTransformExists,
  assertValidationParent,
} from "@ranki/package-api-v2/helpers";

export const block_v2: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);
  return children;
};

export const transformList = {
  block_v2,
};
