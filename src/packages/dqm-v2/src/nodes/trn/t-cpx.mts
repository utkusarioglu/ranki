import type {
  ICpx,
  ISerializedNode,
  ITCpsNode,
  ITCpxNode,
} from "@dqm/package-dqm-api-v2";
import { trnCapability } from "./capabilities/trn.cap.mjs";
import { edgeCapability } from "../capabilities/edge.capability.mjs";

export class TCpxNode implements ITCpxNode {
  public readonly cpx: ICpx;
  public readonly tCps: ITCpsNode[] = [];
  private tCpxV = edgeCapability<ITCpxNode>(this, "TCpx");
  private trn = trnCapability(this);

  constructor(cpx: ICpx) {
    this.cpx = cpx;
  }

  transform(): this {
    this.getTCpxEdges().forEach((t) => t.transform());
    this.trn.getTrn().forEach((t) => t.transform());
    return this;
  }

  serialize(): ISerializedNode[] {
    return this.tCps[0].serialize();
  }

  pushTCpsEdge(tCps: ITCpsNode): this {
    this.tCps.push(tCps);
    return this;
  }

  // TRN
  assignTrn = this.trn.assignTrn.bind(this.trn);
  getTrn = this.trn.getTrn.bind(this.trn);

  // vertices
  setTCpxParent = this.tCpxV.setParent.bind(this.tCpxV);
  pushTCpxEdge = this.tCpxV.pushEdge.bind(this.tCpxV);
  getTCpxEdges = this.tCpxV.getEdges.bind(this.tCpxV);
}
