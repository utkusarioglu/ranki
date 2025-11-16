import type {
  ComponentChain,
  // ComponentHandler,
  ComponentPluginTransformFunc,
  ComponentPluginTransformFuncMulti,
  TransformNodeLeaf,
  ValidationNode,
} from "../export.type.mjs";
import type { TransformNode, TransformNodeParent } from "../export.type.mjs";

// TODO create a separate type for this;
// type TransformHandler = ComponentHandler;

type CreateTransformerFunc = (
  chain: ComponentChain,
  nodes: Record<string, ComponentPluginTransformFunc>,
) => {
  single: ComponentPluginTransformFunc;
  list: ComponentPluginTransformFuncMulti;
};

export const createTransformer: CreateTransformerFunc = (
  localChain,
  localNodes,
) => {
  const nodeRecord: Record<string, ComponentPluginTransformFunc> = {};
  const localChainStr = localChain.join(".");

  const getKey = (creator: string) => {
    return [localChainStr, creator].join(":");
  };

  Object.entries(localNodes).forEach(([creator, callback]) => {
    nodeRecord[getKey(creator)] = callback;
  });

  const transformSingle: ComponentPluginTransformFunc = (v) => {
    const transformChain = v.plugins.transformer.chain;
    const transformChainStr = transformChain.join(".");
    const transformKey = [transformChainStr, v.creator].join(":");
    const local = nodeRecord[transformKey] as
      | ComponentPluginTransformFunc
      | undefined;
    if (local) {
      return local(v);
    } else {
      console.log(transformChainStr === localChainStr);
      if (transformChainStr === localChainStr) {
        console.log("ERROR:", { v, nodes: localNodes, nodeRecord });
        throw new Error(
          `CANNOT FIND LOCAL TRANSFORMER FOR: ${v.creator} IN ${localChainStr} CHAIN`,
        );
      }
      const transformed = v.context.parseTransform(v);
      assertTransformExists(transformed);
      return transformed;
    }
  };

  const transformList = (v2PayloadSections: ValidationNode[]) =>
    v2PayloadSections.reduce(
      (a, c) => [...a, ...transformSingle(c)],
      [] as TransformNode[],
    );

  return {
    single: transformSingle,
    list: transformList,
  };
};

export function assertTransformParent(
  t: TransformNode,
): asserts t is TransformNodeParent {
  if (t.kind !== "parent")
    throw new Error(
      `EXPECTED TRANSFORM NODE ${t.tag}:${t.creator} TO BE A PARENT`,
    );
}

export function assertTransformLeaf(
  t: TransformNode,
): asserts t is TransformNodeLeaf {
  if (t.kind !== "leaf")
    throw new Error(
      `EXPECTED TRANSFORM NODE ${t.tag}:${t.creator} TO BE A LEAF`,
    );
}

export function assertTransformExists(
  t: TransformNode[] | null,
): asserts t is TransformNode[] {
  if (t === null)
    throw new Error("EXPECTED LEGAL TRANSFORM NODE ARRAY AND NOT NULL");
}
