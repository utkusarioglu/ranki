import type {
  ComponentPluginTransformFunc,
  TransformNodeLeaf,
} from "../export.type.mjs";
import type { TransformNode, TransformNodeParent } from "../export.type.mjs";

export const createTransformer: (
  nodes: Record<string, ComponentPluginTransformFunc>,
) => ComponentPluginTransformFunc = (nodes) => {
  const transform: ComponentPluginTransformFunc = (v) => {
    const local = nodes[v.creator] as ComponentPluginTransformFunc | undefined;
    if (local) {
      return local(v);
    } else {
      const transformed = v.context.parseTransform(v);
      if (transformed === null) {
        throw new Error("EXPECTED TRANSFORM NODE ARRAY");
      }
      return transformed;
    }
  };
  return transform;
};

export function assertTransformParent(
  t: TransformNode,
): asserts t is TransformNodeParent {
  if (t.kind !== "parent")
    throw new Error(`EXPECTED TRANSFORM NODE ${t.creator} TO BE A PARENT`);
}

export function assertTransformLeaf(
  t: TransformNode,
): asserts t is TransformNodeLeaf {
  if (t.kind !== "leaf")
    throw new Error(`EXPECTED TRANSFORM NODE ${t.creator} TO BE A LEAF`);
}

export function assertTransformExists(
  t: TransformNode[] | null,
): asserts t is TransformNode[] {
  if (t === null) throw new Error("EXPECTED LEGAL TRANSFORM NODE ARRAY");
}
