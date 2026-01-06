import type {
  ICpx,
  ISerializedNode,
  ITCpsNode,
  ITCpxNode,
} from "@dqm/package-dqm-api-v2";
import { trnCapability } from "./capabilities/trn.cap.mjs";
import { verticesCapability } from "../capabilities/vertices.capability.mjs";

export class TCpxNode implements ITCpxNode {
  public readonly cpx: ICpx;
  public readonly tCps: ITCpsNode[] = [];
  private tCpxV = verticesCapability<this, ITCpxNode>(this);
  private trn = trnCapability(this);

  constructor(cpx: ICpx) {
    this.cpx = cpx;
  }

  transform(): this {
    this.getChildren().forEach((t) => t.transform());
    this.trn.getTrn().forEach((t) => t.transform());
    // console.log(this.cpx.getChainListString(), this.trn.getTrn());
    return this;
  }

  serialize(): ISerializedNode[] {
    this.getChildren().forEach((t) => t.transform());
    this.trn.getTrn().forEach((t) => t.transform());
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
  setParent = this.tCpxV.setParent.bind(this.tCpxV);
  pushChild = this.tCpxV.pushChild.bind(this.tCpxV);
  getChildren = this.tCpxV.getChildren.bind(this.tCpxV);
}
