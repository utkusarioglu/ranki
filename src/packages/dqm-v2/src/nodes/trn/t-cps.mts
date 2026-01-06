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
  // private chain!: Chain;
  // private source!: AstSourceString;
  // private tc: TransformClass | null = null;

  constructor(cps: ICps, tCpx: ITCpxNode) {
    this.cps = cps;
    this.tCpx = tCpx;
  }

  // setChain(chain: Chain): this {
  //   this.chain = chain;
  //   return this;
  // }

  // setSource(s: AstSourceString): this {
  //   this.source = s;
  //   return this;
  // }

  serialize(): ISerializedNode[] {
    const trn = this.getTrn();
    console.log("cps, serialization", trn.length);
    return trn.map((t) => t.serialize().serialized).flat();
    // return [];
    //   console.log(this.chain, this.source);
  }

  // setTransformClass(tc: TransformClass): this {
  //   this.tc = tc;
  //   return this;
  // }

  // getTransformClass(): TransformClass | null {
  //   return this.tc;
  // }

  // VERTICES
  setTCpsParent = this.tCpsV.setParent.bind(this.tCpsV);
  pushTCpsEdge = this.tCpsV.pushEdge.bind(this.tCpsV);
  getTCpsEdges = this.tCpsV.getEdges.bind(this.tCpsV);

  // TRN
  assignTrn = this.trn.assignTrn.bind(this.trn);
  getTrn = this.trn.getTrn.bind(this.trn);
}
