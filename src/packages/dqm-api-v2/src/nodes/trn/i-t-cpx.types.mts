import type {
  ICpx,
  IEdgeCapability,
  ISerializedNode,
} from "../export.types.mjs";
import type { ITrnCapability } from "../capabilities/trn.cap.types.mjs";
import type { ITCpsNode } from "./i-t-cps.types.mjs";

type TCpxEdges = IEdgeCapability<
  ITCpxNode,
  ITCpxNode,
  "TCpx",
  "setTCpxParent" | "getTCpxEdges" | "pushTCpxEdge"
>;

export interface ITCpxNode extends ITCpxNodeUnique, ITrnCapability, TCpxEdges {}

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
