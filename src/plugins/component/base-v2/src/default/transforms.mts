import type {
  ComponentPluginTransformFunc,
  TransformNode,
} from "@ranki/package-api-v2";
import {
  assertTransformExists,
  assertTransformLeaf,
  assertValidationLeaf,
  assertValidationParent,
  assertValidationSingleChild,
  // flattenValidationChildren,
} from "@ranki/package-api-v2/helpers";

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

const section_empty: ComponentPluginTransformFunc = (v) => {
  assertValidationLeaf(v);
  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "nothing"].join("."),
      kind: "leaf",
      source: v.source,
    },
  ]);
};

const root_ignore: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  assertValidationSingleChild(v);
  // TODO this needs to access the child because the `PayloadPlain` parent
  // doesn't have the prefix and suffix yet merged into the content
  const source = v.children[0].source;
  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "ignored"].join("."),
      kind: "leaf",
      source,
    },
  ]);
};

const word_base: ComponentPluginTransformFunc = (v) => {
  assertValidationLeaf(v);

  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "word", "generic"].join("."),
      kind: "leaf",
      source: v.source,
    },
  ]);
};

const word_number: ComponentPluginTransformFunc = (v) => {
  assertValidationLeaf(v);
  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "word", "generic"].join("."),
      kind: "leaf",
      source: v.source,
    },
  ]);
};

const decorated_base: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  assertValidationSingleChild(v);
  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);
  // right now this only fails if a number is being returned
  // if (!children.find((c) => c.creator !== "word_base")) {
  //   return v.context.newTransformNode(v, children);
  // }

  const suffix =
    v.shape.spaces["suffix"].type !== "nl" ? v.shape.spaces["suffix"].raw : "";

  const child = children[0];
  assertTransformLeaf(child);
  const creator = child.creator;
  switch (creator) {
    case "word_base":
      return v.context.newTransformNode(v, [
        {
          tag: ["base", "v2", "word", "generic"].join("."),
          kind: "leaf",
          source: {
            type: "raw",
            raw: child.source.raw + suffix,
          },
          // children,
        },
      ]);

    case "word_number":
      return v.context.newTransformNode(v, [
        {
          tag: ["base", "v2", "number", "generic"].join("."),
          kind: "leaf",
          source: {
            type: "raw",
            raw: child.source.raw + suffix,
          },
          // children,
        },
      ]);

    default:
      throw new Error(`UNRECOGNIZED DECORATED_BASE CHILD: ${creator}`);
  }

  // return v.context.newTransformNode(v, [
  //   {
  //     tag: ["base", "v2", "decorated_base"].join("."),
  //     kind: "parent",
  //     children,
  //   },
  // ]);
};

const decorated_fallback: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "word", "generic"].join("."),
      kind: "leaf",
      source: {
        type: "raw",
        raw: v.source.raw + v.shape.spaces["suffix"].raw,
      },
    },
  ]);
};

const p: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);
  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "paragraph"].join("."),
      kind: "parent",
      children,
    },
  ]);
};

const lexemes: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const childrenUncombined = v.context.parseTransform(v.children);
  // console.log({ v, children });
  // const lexemes = flattenValidationChildren(v);
  // const children = v.context.parseTransform(lexemes);
  // console.log({ children });
  assertTransformExists(childrenUncombined);

  const children: TransformNode[] = [];
  childrenUncombined.forEach((c) => {
    if (!children.length) {
      children.push(c);
      return;
    }
    assertTransformLeaf(c);

    const prev = children.at(-1)!;
    assertTransformLeaf(prev);
    switch (c.tag) {
      case ["base", "v2", "number", "generic"].join("."):
        children.push(c);
        break;
      case ["base", "v2", "word", "generic"].join("."):
        if (prev.tag === c.tag) {
          prev.source.raw += c.source.raw;
        } else {
          children.push(c);
        }
        break;
      default:
        console.log(c);
        throw new Error(`UNRECOGNIZED CHILD TAG: ${c.creator}`);
    }
  });

  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "lexeme"].join("."),
      kind: "parent",
      children,
    },
  ]);
};

const line: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children = v.context.parseTransform(v.children);
  // const lexemes = flattenValidationChildren(v);
  // const children = v.context.parseTransform(lexemes);
  assertTransformExists(children);
  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "line"].join("."),
      kind: "parent",
      children,
    },
  ]);
};

export const transformList = {
  root_structure,
  section_base,
  section_empty,
  p,
  root_ignore,
  line,
  decorated_base,
  word_base,
  word_number,
  decorated_fallback,
  lexemes,
};
