import type {
  CommonTransportsConstructorParams,
  DqmConfig,
  IAstNode,
  ICps,
  ISerializedNode,
  ITrnCpsNode,
  ITrnCpsRootNode,
  ITrnCpxNode,
  TrnCpxRegistry,
} from "@dqm/package-dqm-api-v2";
import { TrnCpsNode } from "./trn-cps.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { verticesCapability } from "../capabilities/vertices.capability.mjs";

export class TrnCpsRootNode extends TrnCpsNode implements ITrnCpsRootNode {
  private readonly rootVertices = verticesCapability<this, ITrnCpsRootNode>(
    this,
  );
  public readonly cps: ICps;
  private trnCpx!: ITrnCpxNode;
  // private acceptsList: ITrnCpsNodeAccepts[] = [];

  constructor(
    cps: ICps,
    registry: TrnCpxRegistry,
    s: CommonTransportsConstructorParams,
  ) {
    super(s);
    this.setRoot(this);
    this.cps = cps;
    this.determineCpx(registry);
    // this.callRootChildren(registry, s);
  }

  // acceptsRoot(c: TransformClass, node: ITrnCpsNode): this {
  //   this.acceptsList.push({
  //     transformClass: c,
  //     node,
  //   });
  //   return this;
  // }

  override serialize(): ISerializedNode[] {
    this.getRootChildren().map((r) => r.serialize());
    const own = super.serialize();
    return own;
  }

  // private callRootChildren(
  //   registry: TrnCpxRegistry,
  //   s: CommonTransportsConstructorParams,
  // ) {
  //   const TrnCpsRoot = this.getPlugins().getTrnCpsRootNodeConstructor();
  //   this.cps.getChildren().forEach((c) => {
  //     const newNode = new TrnCpsRoot(c, registry, s).setRootParent(this);
  //     this.pushRootChild(newNode);
  //   });
  // }

  private determineCpx(registry: TrnCpxRegistry) {
    const cpx = this.cps.getCpx();
    assertExists(cpx, { why: "Cpx need to be defined for all cps" });
    const trnCpx = registry.get(cpx);
    assertExists(trnCpx, { why: "TrnCpx should be available at this step" });
    this.setTrnCpx(trnCpx);
  }

  override newChild(): ITrnCpsNode {
    const transports = this.getTransports();
    const TrnCps = this.getPlugins().getTrnCpsNodeConstructor();
    const n = new TrnCps(transports);
    (n as TrnCpsNode).setParent(this).setRoot(this);
    // this.pushChild(n);

    return n;
  }

  getTCpx(): ITrnCpxNode {
    return this.trnCpx;
  }

  private setTrnCpx(trnCpx: ITrnCpxNode): this {
    this.trnCpx = trnCpx;
    trnCpx.pushChildTrnCpsRootNode(this);
    return this;
  }

  override getRoot() {
    return this;
  }

  getRootAst(): IAstNode {
    const cpx = this.cps.getCpx();
    assertExists(cpx, { why: "Cps implies cpx" });
    return cpx.getRootAst();
  }

  getComponentConfig() {
    return this.cps.getComponentConfig();
  }

  getDqmConfig(): DqmConfig {
    return this.cps.getDqmConfig();
  }

  // TRN CPS VERTICES
  setRootParent = this.rootVertices.setParent.bind(this.rootVertices);
  pushRootChild = this.rootVertices.pushChild.bind(this.rootVertices);
  getRootChildren = this.rootVertices.getChildren.bind(this.rootVertices);
}
