import type {
  ICps,
  IEdgeCapability,
  ISerializedNode,
  SerializeMethodParams,
} from "../export.types.mjs";
import type { ITrnCapability } from "../capabilities/trn.cap.types.mjs";
import type { ITCpxNode } from "./i-t-cpx.types.mjs";

type TCpsEdges = IEdgeCapability<
  ITCpsNode,
  ITCpsNode,
  "TCps",
  "setTCpsParent" | "getTCpsEdges" | "pushTCpsEdge"
>;

export interface ITCpsNode
  extends TCpsEdges,
    ICpsUniqueCapability,
    ITrnCapability {}

interface ICpsUniqueCapability {
  readonly cps: ICps;
  readonly tCpx: ITCpxNode;

  serialize(p: SerializeMethodParams): ISerializedNode[];
}
