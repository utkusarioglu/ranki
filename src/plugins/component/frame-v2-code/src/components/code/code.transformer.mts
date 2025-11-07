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
  console.log(v);
  return v.context.newTransformNode(v, [
    {
      kind: "leaf",
      tag: "computer_science.code.block.section",
      hoist: 0,
      props: v.plugins.transformer!.props,
      source: {
        type: "raw",
        raw: v.source.raw,
      },
    },
  ]);
};

function fallThrough(v: ValidationNode): never {
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
      default:
        fallThrough(c);
    }
    // all.push(...transform(c));
  });

  const children = v.context.newTransformNode(v, all);

  const code = v.context.newTransformNode(v, [
    {
      tag: "code",
      kind: "parent",
      hoist: 0,
      children,
    },
  ]);
  return code;
};
