import type { DqmConfig, TransformClass } from "../../export.types.mjs";
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

  accepts(c: TransformClass, node: ITrnCpsNode): this;
  getComponentConfig(): any;
  getDqmConfig(): DqmConfig;

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
