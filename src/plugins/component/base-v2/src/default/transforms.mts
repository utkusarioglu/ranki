import type {
  ComponentPluginTransformFunc,
  TransformNode,
} from "@ranki/package-api-v2";
import {
  assertTransformExists,
  // assertTransformLeaf,
  assertValidationLeaf,
  assertValidationParent,
  assertValidationSingleChild,
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

export const rootLine: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const children = v.context.parseTransform(v.children);
  assertTransformExists(children);
  return v.context.newTransformNode(v, children);
};

const section_empty: ComponentPluginTransformFunc = (v) => {
  assertValidationLeaf(v);
  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "nothing", v.shape.direction].join("."),
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
      tag: ["base", "v2", "ignored", v.shape.direction].join("."),
      kind: "leaf",
      source,
    },
  ]);
};

const word_base: ComponentPluginTransformFunc = (v) => {
  assertValidationLeaf(v);

  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "text", "generic", v.shape.direction].join("."),
      kind: "leaf",
      source: v.source,
    },
  ]);
};

const word_number: ComponentPluginTransformFunc = (v) => {
  assertValidationLeaf(v);
  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "text", "generic", v.shape.direction].join("."),
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
  // assertTransformLeaf(child);
  if (child.kind === "parent") {
    return v.context.newTransformNode(v, [child]);
  }

  const creator = child.creator;
  switch (creator) {
    case "word_base":
      return v.context.newTransformNode(v, [
        {
          tag: ["base", "v2", "text", "generic", v.shape.direction].join("."),
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
          tag: ["base", "v2", "number", "generic", v.shape.direction].join("."),
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
      tag: ["base", "v2", "text", "generic", v.shape.direction].join("."),
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
      tag: ["base", "v2", "paragraph", v.shape.direction].join("."),
      kind: "parent",
      children,
    },
  ]);
};

// !FIX this currently makes new frames a member of the same lexeme
// I cannot decide whether frames should automatically create a new lexeme
// or be a part of any that exists.
const lexemes: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const childrenUncombined = v.context.parseTransform(v.children);
  assertTransformExists(childrenUncombined);

  let carry = "";
  const children: TransformNode[] = [];
  childrenUncombined.forEach((child, i) => {
    if (!children.length) {
      children.push(child);
      return;
    }
    // assertTransformLeaf(c);
    if (child.kind === "parent") {
      carry = v.children[i].shape.spaces["suffix"].raw;
      return children.push(...v.context.newTransformNode(v, [child]));
    }

    const prev = children.at(-1)!;
    if (prev.kind === "parent") {
      child.source.raw = carry + child.source.raw;
      carry = "";
      return children.push(child);
    }
    // assertTransformLeaf(prev);
    switch (child.tag) {
      case ["base", "v2", "number", "generic", v.shape.direction].join("."):
        children.push(child);
        break;
      case ["base", "v2", "text", "generic", v.shape.direction].join("."):
        if (prev.tag === child.tag) {
          prev.source.raw += carry + child.source.raw;
          carry = "";
        } else {
          children.push(child);
        }
        break;
      default:
        console.log(child);
        throw new Error(`UNRECOGNIZED CHILD TAG: ${child.creator}`);
    }
  });

  return v.context.newTransformNode(v, [
    {
      tag: ["base", "v2", "lexeme", v.shape.direction].join("."),
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
      tag: ["base", "v2", "line", v.shape.direction].join("."),
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
  rootLine,
};
