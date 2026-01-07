import type {
  CommonTransportsConstructorParams,
  ICps,
  ISerializedNode,
  ITCpsNode,
  ITCpxNode,
  SerializeMethodParams,
} from "@dqm/package-dqm-api-v2";
import { edgeCapability } from "../capabilities/edge.capability.mjs";
import { trnCapability } from "./capabilities/trn.cap.mjs";
import { CommonTransports } from "../common-transports.mjs";

export class TCpsNode extends CommonTransports implements ITCpsNode {
  public readonly cps: ICps;
  public readonly tCpx: ITCpxNode;
  private trn = trnCapability(this);
  public readonly tCpsV = edgeCapability<ITCpsNode>(this, "TCps");

  constructor(
    cps: ICps,
    tCpx: ITCpxNode,
    s: CommonTransportsConstructorParams,
  ) {
    super(s);
    this.cps = cps;
    this.tCpx = tCpx;
  }

  serialize(p: SerializeMethodParams): ISerializedNode[] {
    const trn = this.getTrn();
    if (!(trn && trn.length)) {
      const chain = this.cps.getChain();
      const TrnNode = this.getPlugins().getTrnNodeConstructor();
      const trn = new TrnNode(
        this.tCpx.cpx.getRootAst(),
        this.tCpx,
        this,
        [this],
        this.getTransports(),
      );
      const transformer = this.getPlugins().getTransformer(chain, "FRAME_V2");
      transformer(trn);
      const ser = trn.serialize(p);
      console.log("blank cps", ser);
      // this.getPlugins().getTransformer(chain, "FRAME_V2");

      return ser.serialized;
    }
    return trn.map((t) => t.serialize(p).serialized).flat();
  }

  // VERTICES
  setTCpsParent = this.tCpsV.setParent.bind(this.tCpsV);
  pushTCpsEdge = this.tCpsV.pushEdge.bind(this.tCpsV);
  getTCpsEdges = this.tCpsV.getEdges.bind(this.tCpsV);

  // TRN
  assignTrn = this.trn.assignTrn.bind(this.trn);
  getTrn = this.trn.getTrn.bind(this.trn);
}
