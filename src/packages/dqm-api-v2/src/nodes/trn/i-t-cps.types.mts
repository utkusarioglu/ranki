import type {
  ICps,
  ISerializedNode,
  IVerticesCapability,
} from "../export.types.mjs";
import type { ITrnCapability } from "./capabilities/trn.cap.types.mjs";
import type { ITCpxNode } from "./i-t-cpx.types.mjs";

export interface ITCpsNode
  extends Pick<
      IVerticesCapability<ITCpsNode>,
      "setParent" | "getChildren" | "pushChild"
    >,
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
