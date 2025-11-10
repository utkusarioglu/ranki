import type { ComponentPluginTransformFunc } from "@ranki/package-api-v2";
import {
  assertTransformExists,
  assertValidationLeaf,
  assertValidationParent,
  flattenValidationChildren,
} from "@ranki/package-api-v2/helpers";

const root_ignore: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  return v.context.newTransformNode(v, [
    {
      tag: "span",
      kind: "leaf",
      hoist: 0,
      source: v.children[0].source,
    },
  ]);
};

const word_base: ComponentPluginTransformFunc = (v) => {
  assertValidationLeaf(v);

  return v.context.newTransformNode(v, [
    {
      tag: "base.v2.word_base",
      kind: "leaf",
      hoist: 0,
      source: v.source,
    },
  ]);
};

const word_number: ComponentPluginTransformFunc = (v) => {
  assertValidationLeaf(v);
  return v.context.newTransformNode(v, [
    {
      tag: "base.v2.word_number",
      kind: "leaf",
      hoist: 0,
      source: v.source,
    },
  ]);
};

const decorated_base: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);

  return v.context.newTransformNode(v, [
    {
      tag: "base.v2.decorated_base",
      kind: "parent",
      hoist: 0,
      children,
    },
  ]);
};

const root_structure: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);
  return v.context.newTransformNode(v, children);
};

const section_base: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);
  return v.context.newTransformNode(v, children);
};

const p: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);
  return v.context.newTransformNode(v, [
    {
      tag: "paragraph",
      kind: "parent",
      hoist: 0,
      children,
    },
  ]);
};

const line: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const lexemes = flattenValidationChildren(v);
  const children = v.context.parseTransform(lexemes);
  assertTransformExists(children);
  return v.context.newTransformNode(v, [
    {
      tag: "base.v2.line",
      kind: "parent",
      hoist: 0,
      children,
    },
  ]);
};

export const transformList = {
  root_structure,
  section_base,
  p,
  root_ignore,
  line,
  decorated_base,
  word_base,
  word_number,
};
