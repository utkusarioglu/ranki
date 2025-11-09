import type {
  ComponentHandler,
  ComponentPluginTransformFunc,
  TransformNodeLeaf,
} from "../export.type.mjs";
import type { TransformNode, TransformNodeParent } from "../export.type.mjs";

// TODO create a separate type for this;
type TransformHandler = ComponentHandler;

type CreateTransformerFunc = (
  handler: TransformHandler,
  nodes: Record<string, ComponentPluginTransformFunc>,
) => ComponentPluginTransformFunc;

export const createTransformer: CreateTransformerFunc = (handler, nodes) => {
  const transformSingle: ComponentPluginTransformFunc = (v) => {
    const local = nodes[v.creator] as ComponentPluginTransformFunc | undefined;
    if (local) {
      return local(v);
    } else {
      if (v.plugins.transformer.handler === handler) {
        throw new Error(`CANNOT FIND LOCAL TRANSFORMER FOR: ${v.creator}`);
      }
      const transformed = v.context.parseTransform(v);
      if (transformed === null) {
        throw new Error("EXPECTED TRANSFORM NODE ARRAY");
      }
      return transformed;
    }
  };
  return transformSingle;
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
