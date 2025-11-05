import type {
  ComponentPluginTransformFunc,
  TransformNode,
} from "@ranki/package-api-v2";

export const root_structure: ComponentPluginTransformFunc = (n) => {
  if (n.kind !== "parent") {
    throw new Error("EXPECTED PARENT");
  }
  const children: TransformNode[] = [];

  n.children.forEach((c) => {
    switch (c.creator) {
      case "section_base":
        children.push(section_base(c));
        break;
      default:
        throw new Error(`UNKNOWN CHILD: ${c.creator}`);
    }
  });

  return {
    tag: "div",
    kind: "parent" as "parent",
    creator: n.creator,
    depth: n.shape.depth.total,
    children,
  };
};

export const section_base: ComponentPluginTransformFunc = (n) => {
  if (n.kind !== "parent") {
    throw new Error("EXPECTED PARENT");
  }
  const children: TransformNode[] = [];

  n.children.forEach((c) => {
    switch (c.creator) {
      case "block_v2":
        children.push(block_v2(c));
        break;
      case "p":
        children.push(p(c));
        break;
      default:
        // console.log("before", c);
        // const external = c.context.parseTransform(c);
        // if (external) {
        //   children.push(external);
        // }

        throw new Error(`UNKNOWN CHILD: ${c.creator}`);
    }
  });

  return {
    tag: "div",
    kind: "parent" as "parent",
    creator: n.creator,
    depth: n.shape.depth.total,
    children,
  };
};

export const p: ComponentPluginTransformFunc = (n) => {
  if (n.kind !== "parent") {
    throw new Error("EXPECTED PARENT");
  }
  // const children: TransformNode[] = [];

  // n.children.forEach((c) => {
  //   switch (c.creator) {
  //     case "block_v2":
  //       children.push(section_base(c));
  //       break;
  //     default:
  //       throw new Error(`UNKNOWN CHILD: ${c.creator}`);
  //   }
  // });

  return {
    tag: "paragraph",
    kind: "leaf" as "leaf",
    print: true,
    creator: n.creator,
    depth: n.shape.depth.total,
    source: n.source,
  };
};

export const block_v2: ComponentPluginTransformFunc = (n) => {
  if (n.kind !== "parent") {
    throw new Error("EXPECTED PARENT");
  }
  const children: TransformNode[] = [];

  n.children.forEach((c) => {
    switch (c.creator) {
      case "v2_fp":
        children.push(c.context.parseTransform(c) as TransformNode);
        break;
      default:
        throw new Error(`UNKNOWN CHILD: ${c.creator}`);
    }
  });

  return {
    tag: "div",
    kind: "parent" as "parent",
    print: true,
    creator: n.creator,
    depth: n.shape.depth.total,
    children,
  };
};
