import type {
  ValidationNodeParent,
  ReducedTransformNode,
  ComponentPluginTransformFunc,
  TransformNode,
  ValidationNode,
} from "@ranki/package-api-v2";
import {
  assertTransformExists,
  assertValidationParent,
} from "@ranki/package-api-v2/helpers";

export const v2PayloadPlain: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  // const all: TransformNode[] = [];
  // v.children.forEach((n) => all.push(...transform(n)));
  // //  transform(v.children);
  // return v.context.newTransformNode(v, all);
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

function fallThrough(v: ValidationNode): never {
  console.log("ERROR NODE:\n", v);
  throw new Error(`UNRECOGNIZED NODE: ${v.creator}`);
}

export const v2PayloadSection: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const all: TransformNode[] = [];
  // v.children.forEach((c) => all.push(...transform(c)));
  v.children.forEach((c) => {
    switch (c.creator) {
      case "v2PayloadPlain":
        all.push(...v2PayloadPlain(c));
        break;
      case "v2_fp":
        const transformed = v.context.parseTransform(c);
        assertTransformExists(transformed);
        all.push(...transformed);
        break;
      default:
        fallThrough(c);
      // throw new Error(`UNRECOGNIZED NODE: ${c.creator}`);
    }
    // switch (c.creator) {
    //   case ""
    // }
  });
  return v.context.newTransformNode(v, all);
};

export const pausedContainer: ComponentPluginTransformFunc = (c) => {
  assertValidationParent(c);
  const transformed = c.context.parseTransform(c.children[0]);
  if (transformed === null) {
    throw new Error("NULL TRANSFORM NODE NOT EXPECTED");
  }
  transformed.forEach((t) => {
    t.hoist = c.shape.hoist;
  });
  const end = c.context.newTransformNode(c, transformed);
  return end;
};

export const v2_fp: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  if (v.children.length > 1) {
    throw new Error("SINGLE CHILD EXPECTED");
  }
  const v2Payload = v.children[0] as ValidationNodeParent;
  if (v2Payload.children.length > 1) {
    throw new Error("SINGLE CHILD EXPECTED");
  }
  const pauseList = v2Payload.children[0];
  if (pauseList.kind !== "parent") throw new Error("PARENT EXPECTED");

  const v2PayloadSections = pauseList.children;

  const all: ReducedTransformNode[] = [];
  v2PayloadSections.forEach((c) => {
    switch (c.creator) {
      case "pausedContainer":
        all.push(...pausedContainer(c));
        break;
      case "v2PayloadSection":
        all.push(...v2PayloadSection(c));
        break;
      // !FIX this doesn't belong here
      case "line":
        all.push({
          kind: "leaf",
          tag: "span",
          creator: c.creator,
          depth: c.shape.depth.total,
          hoist: 1,
          source: {
            type: "raw",
            raw: c.source.raw,
          },
        });
        break;
      default:
        fallThrough(c);
    }
    // all.push(...transform(c));
  });

  const children = v.context.newTransformNode(v, all);

  const code = v.context.newTransformNode(v, [
    {
      tag: ["frame", "v2", "math", "latex", "block", "container"].join("."),
      kind: "parent",
      hoist: 0,
      // // @ts-expect-error
      // params: ["hia"],
      children,
    },
  ]);
  return code;
};
