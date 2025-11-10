import type {
  ValidationNodeParent,
  ComponentPluginTransformFunc,
} from "@ranki/package-api-v2";
import {
  assertTransformExists,
  assertValidationParent,
  assertValidationSingleChild,
} from "@ranki/package-api-v2/helpers";

export const v2PayloadSection: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const all = v.context.parseTransform(v.children);
  assertTransformExists(all);
  return v.context.newTransformNode(v, all);
};

export const pausedContainer: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);
  children.forEach((t) => {
    t.hoist = v.shape.hoist;
  });
  return v.context.newTransformNode(v, children);
};

export const v2_fpCommon: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  assertValidationSingleChild(v);
  const v2Payload = v.children[0] as ValidationNodeParent;
  assertValidationSingleChild(v2Payload);
  const pauseList = v2Payload.children[0];
  assertValidationParent(pauseList);
  const v2PayloadSections = pauseList.children;
  const all = v.context.parseTransform(v2PayloadSections);
  assertTransformExists(all);
  const children = v.context.newTransformNode(v, all);
  return children;
};
