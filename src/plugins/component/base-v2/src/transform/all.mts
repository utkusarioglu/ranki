import type {
  ComponentPluginTransformFunc,
  TransformNode,
} from "@ranki/package-api-v2";
import {
  assertValidationLeaf,
  assertValidationParent,
  createTransformer,
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

  const children = v.children.reduce(
    (a, c) => [...a, ...transform(c)],
    [] as TransformNode[],
  );

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
  const children: TransformNode[] = [];

  v.children.forEach((c) => {
    children.push(...transform(c));
  });

  return v.context.newTransformNode(v, children);
};

const section_base: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children: TransformNode[] = [];

  v.children.forEach((c) => {
    children.push(...transform(c));
  });

  return v.context.newTransformNode(v, children);
};

const p: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);

  const children = v.children.reduce(
    (a, c) => [...a, ...transform(c)],
    [] as TransformNode[],
  );

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

  const children = lexemes.reduce(
    (a, c) => [...a, ...transform(c)],
    [] as TransformNode[],
  );

  return v.context.newTransformNode(v, [
    {
      tag: "base.v2.line",
      kind: "parent",
      hoist: 0,
      children,
    },
  ]);
};

const block_v2: ComponentPluginTransformFunc = (v) => {
  if (v.kind !== "parent") {
    throw new Error("EXPECTED PARENT");
  }
  const children: TransformNode[] = [];

  v.children.forEach((c) => {
    children.push(...transform(c));
  });

  return v.context.newTransformNode(v, children);
};

const NODES: Record<string, ComponentPluginTransformFunc> = {
  root_structure,
  section_base,
  p,
  block_v2,
  root_ignore,
  line,
  decorated_base,
  word_base,
  word_number,
};

export const transform = createTransformer("RankiBaseV2", NODES);
