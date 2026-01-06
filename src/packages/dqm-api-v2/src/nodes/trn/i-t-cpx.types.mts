import type {
  ICpx,
  ISerializedNode,
  IVerticesCapability,
} from "../export.types.mjs";
import type { ITrnCapability } from "./capabilities/trn.cap.types.mjs";
import type { ITCpsNode } from "./i-t-cps.types.mjs";

export interface ITCpxNode
  extends ITCpxNodeUnique,
    ITrnCapability,
    Pick<
      IVerticesCapability<ITCpxNode>,
      "getChildren" | "setParent" | "pushChild"
    > {}

interface ITCpxNodeUnique {
  readonly cpx: ICpx;
  readonly tCps: ITCpsNode[];

  /**
   * This will definitely play a part for placeholders
   */
  transform(): this;

  /**
   * Convert to cacheable objects
   */
  serialize(): ISerializedNode[];

  pushTCpsEdge(tCps: ITCpsNode): this;
}
