import type {
  ICps,
  ISerializedNode,
  ITCpsNode,
  ITCpxNode,
} from "@dqm/package-dqm-api-v2";
import { edgeCapability } from "../capabilities/edge.capability.mjs";
import { trnCapability } from "./capabilities/trn.cap.mjs";

export class TCpsNode implements ITCpsNode {
  public readonly cps: ICps;
  public readonly tCpx: ITCpxNode;
  private trn = trnCapability(this);
  public readonly tCpsV = edgeCapability<ITCpsNode>(this, "TCps");

  constructor(cps: ICps, tCpx: ITCpxNode) {
    this.cps = cps;
    this.tCpx = tCpx;
  }

  serialize(): ISerializedNode[] {
    const trn = this.getTrn();
    return trn.map((t) => t.serialize().serialized).flat();
  }

  // VERTICES
  setTCpsParent = this.tCpsV.setParent.bind(this.tCpsV);
  pushTCpsEdge = this.tCpsV.pushEdge.bind(this.tCpsV);
  getTCpsEdges = this.tCpsV.getEdges.bind(this.tCpsV);

  // TRN
  assignTrn = this.trn.assignTrn.bind(this.trn);
  getTrn = this.trn.getTrn.bind(this.trn);
}
