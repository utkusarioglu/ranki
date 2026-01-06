import type {
  ICps,
  IEdgeCapability,
  ISerializedNode,
  // IVerticesCapability,
} from "../export.types.mjs";
import type { ITrnCapability } from "./capabilities/trn.cap.types.mjs";
import type { ITCpxNode } from "./i-t-cpx.types.mjs";

type TCpsEdges = IEdgeCapability<
  ITCpsNode,
  ITCpsNode,
  "TCps",
  "setTCpsParent" | "getTCpsEdges" | "pushTCpsEdge"
  // "getTCpsEdges"
  // | "setTCpsParent"
  // | "getTCpsParent"
  // | "setTCpsPrev"
  // | "getTCpsPrev"
>;

export interface ITCpsNode

  // Pick<
  //     IVerticesCapability<ITCpsNode>,
  //     "setParent" | "getChildren" | "pushChild"
  // >,
  extends TCpsEdges,
    // IAstNodeTransformCapability,
    ICpsUniqueCapability,
    ITrnCapability {}

interface ICpsUniqueCapability {
  readonly cps: ICps;
  readonly tCpx: ITCpxNode;

  serialize(): ISerializedNode[];

  // setChain(chain: Chain): this;
  // setSource(s: AstSourceString): this;
}
