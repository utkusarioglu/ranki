import type { DqmConfig } from "../../export.types.mjs";
import type {
  CommonTransportsConstructorParams,
  ICps,
  ITrnCpsNode,
  TrnCpxRegistry,
} from "../export.types.mjs";

export interface ITrnCpsRootNode
  extends ITrnCpsNode,
    ITrnCpsVerticesCapability {
  readonly cps: ICps;

  getComponentConfig(): any;
  getDqmConfig(): DqmConfig;

  // acceptsRoot(t: TransformClass, node: ITrnCpsNode): this;

  /**
   * Recursively calls transform on all of its regular children and root children, dfs
   */
  transform(): this;
}

export interface ITrnCpsVerticesCapability {
  setRootParent(parent: ITrnCpsRootNode): this;
  pushRootChild(child: ITrnCpsRootNode): this;
  getRootChildren(): ITrnCpsRootNode[];
}

export type ITrnCpsRootNodeConstructor = new (
  cps: ICps,
  trnCpxRegistry: TrnCpxRegistry,
  s: CommonTransportsConstructorParams,
) => ITrnCpsRootNode;
