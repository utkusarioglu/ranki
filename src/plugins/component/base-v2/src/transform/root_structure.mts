import type {
  ComponentPluginTransformFunc,
  TransformNode,
} from "@ranki/package-api-v2";

export const root_structure: ComponentPluginTransformFunc = (v) => {
  if (v.kind !== "parent") {
    throw new Error("EXPECTED PARENT");
  }
  const children: TransformNode[] = [];

  v.children.forEach((c) => {
    switch (c.creator) {
      case "section_base":
        children.push(...section_base(c));
        break;
      default:
        throw new Error(`UNKNOWN CHILD: ${c.creator}`);
    }
  });

  return v.context.newTransformNode(v, [
    {
      tag: "div",
      kind: "parent" as "parent",
      hoist: 0,
      // creator: v.creator,
      // depth: v.shape.depth.total,
      children,
    },
  ]);
};

export const section_base: ComponentPluginTransformFunc = (v) => {
  if (v.kind !== "parent") {
    throw new Error("EXPECTED PARENT");
  }
  const children: TransformNode[] = [];

  v.children.forEach((c) => {
    switch (c.creator) {
      // !FIX BaseV2 does not need to know about block_v2. this needs to be moved to FrameV2
      case "block_v2":
        children.push(...block_v2(c));
        break;
      case "p":
        children.push(...p(c));
        break;
      default:
        throw new Error(`UNKNOWN CHILD: ${c.creator}`);
    }
  });

  return v.context.newTransformNode(v, [
    {
      tag: "div",
      kind: "parent" as "parent",
      hoist: 0,
      // creator: v.creator,
      // depth: v.shape.depth.total,
      children,
    },
  ]);
};

export const p: ComponentPluginTransformFunc = (v) => {
  if (v.kind !== "parent") {
    throw new Error("EXPECTED PARENT");
  }

  return v.context.newTransformNode(v, [
    {
      tag: "paragraph",
      kind: "leaf" as "leaf",
      hoist: 0,
      print: true,
      // creator: v.creator,
      // depth: v.shape.depth.total,
      source: v.source,
    },
  ]);
};

export const block_v2: ComponentPluginTransformFunc = (v) => {
  if (v.kind !== "parent") {
    throw new Error("EXPECTED PARENT");
  }
  const children: TransformNode[] = [];

  v.children.forEach((c) => {
    switch (c.creator) {
      case "v2_fp":
        children.push(...(c.context.parseTransform(c) as TransformNode[]));
        break;
      default:
        throw new Error(`UNKNOWN CHILD: ${c.creator}`);
    }
  });

  return v.context.newTransformNode(v, [
    {
      tag: "div",
      kind: "parent" as "parent",
      hoist: 0,
      // creator: v.creator,
      // depth: v.shape.depth.total,
      children,
    },
  ]);
};
