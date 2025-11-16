import type {
  ValidationNodeParent,
  ComponentPluginTransformFunc,
  TransformNode,
} from "@ranki/package-api-v2";
import {
  assertTransformExists,
  // assertTransformLeaf,
  assertValidationParent,
  assertValidationSingleChild,
} from "@ranki/package-api-v2/helpers";

export const v2PayloadSectionItem: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const all = v.context.parseTransform(v.children);
  assertTransformExists(all);
  all.push(
    ...v.context.newTransformNode(v, [
      {
        kind: "leaf",
        tag: "SPACES",
        source: {
          type: "raw",
          raw: v.shape.spaces["suffix"].raw,
        },
      },
    ]),
  );

  assertTransformExists(all);
  return v.context.newTransformNode(v, all);
};

export const v2PayloadSection: ComponentPluginTransformFunc = (v) => {
  assertValidationParent(v);
  const all = v.context.parseTransform(v.children);
  assertTransformExists(all);
  console.log("v2PayloadSection", all);
  const merged: TransformNode[] = [];
  let carry = "";
  all.forEach((n, i) => {
    switch (n.kind) {
      case "parent":
        merged.push(n);
        break;
      case "leaf":
        if (i === 0) {
          if (n.tag === "SPACES") {
            carry = n.source.raw;
          } else {
            merged.push(n);
          }
          return;
        }

        const prev = merged.at(-1)!;
        switch (n.tag) {
          case "SPACES":
            if (prev.kind === "leaf") {
              prev.source.raw += n.source.raw;
            } else {
              carry = n.source.raw;
            }
            break;
          default:
            if (n.kind === "leaf") {
              n.source.raw = carry + n.source.raw;
              carry = "";
              merged.push(n);
            } else {
              merged.push(n);
            }
        }
    }
  });
  console.log("merged", merged);
  return v.context.newTransformNode(v, merged);
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
  switch (pauseList.kind) {
    case "parent":
      // assertValidationParent(pauseList);
      const v2PayloadSections = pauseList.children;
      const all = v.context.parseTransform(v2PayloadSections);
      assertTransformExists(all);

      const worked: TransformNode[] = [];
      all.forEach((curr) => {
        if (!worked.length) {
          worked.push(curr);
          return;
        }
        const prev = worked.at(-1)!;
        // !FIX this is broken
        // comparison by leaf is not a good idea
        // also, the whitespaces aren't captured by PayloadPlain
        // or maybe they are but they aren't being communicated here.
        const prevPlain = prev.kind === "leaf";
        const currPlain = curr.kind === "leaf";
        if (prevPlain && currPlain) {
          // assertTransformLeaf(prev);
          // assertTransformLeaf(curr);
          prev.source.raw += curr.source.raw;
        } else {
          worked.push(curr);
        }
      });

      const children = v.context.newTransformNode(v, worked);
      return children;

    case "leaf":
      // assertValidationParent(pauseList);
      // const v2PayloadSectionsL = pauseList.children;
      const all2 = v.context.parseTransform(pauseList);
      assertTransformExists(all2);
      const children2 = v.context.newTransformNode(v, all2);
      return children2;
  }
};

export const frameV2CommonTransforms = {
  v2PayloadSection,
  v2PayloadSectionItem,
  pausedContainer,
};
