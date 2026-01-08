import type {
  ICpx,
  ISerializedNode,
  ITCpsNode,
  ITCpxNode,
  SerializeMethodParams,
} from "@dqm/package-dqm-api-v2";
import { trnCapability } from "./capabilities/trn.cap.mjs";
import { edgeCapability } from "../capabilities/edge.capability.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
// @ts-ignore
import { assertParent } from "../../errors/render-error/assertions.mjs";

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

  serialize(p: SerializeMethodParams): ISerializedNode[] {
    // TODO not sure if this is relevant
    // const childrenCpx = this.getTCpxEdges()
    //   .map((t) => t.serialize(p))
    //   .flat();
    // console.log("c", childrenCpx);

    // console.log("l", this.tCps.length);

    // let curr: ISerializedNode[] | undefined = childrenCpx;
    let curr: ISerializedNode[] | undefined;
    for (let i = this.tCps.length - 1; i >= 0; i--) {
      const n = this.tCps[i].serialize(p);
      // console.log(i);
      if (curr) {
        assertParent(n[0], {
          why: "Cps composition requires the outer components to be parents",
        });
        n[0].children.push(...curr);
      }
      curr = n;
    }
    assertExists(curr, { why: "Every tCpx need to contain at least one tCps" });
    return curr;

    // const tCps = this.tCps[0];
    // assertExists(tCps, { why: "Each TCpx need to contain at least one tCps" });
    // return tCps.serialize(p);
  }

  pushTCpsEdge(tCps: ITCpsNode): this {
    // console.log("push", tCps.cps.getChainString());
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
