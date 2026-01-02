import type {
  CommonTransportsConstructorParams,
  DqmConfig,
  IAstNode,
  ICps,
  ISerializedNode,
  ITrnCpsNode,
  ITrnCpsRootNode,
  ITrnCpxNode,
  TransformClass,
  TrnCpxRegistry,
} from "@dqm/package-dqm-api-v2";
import { TrnCpsNode } from "./trn-cps.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { verticesCapability } from "../capabilities/vertices.capability.mjs";

interface Slot {
  tClass: TransformClass;
  parent: ITrnCpsNode;
}

export class TrnCpsRootNode extends TrnCpsNode implements ITrnCpsRootNode {
  private rootVertices = verticesCapability<this, ITrnCpsRootNode>(this);
  private slots: Slot[] = [];
  public readonly cps!: ICps;
  private trnCpx!: ITrnCpxNode;

  constructor(
    cps: ICps,
    registry: TrnCpxRegistry,
    s: CommonTransportsConstructorParams,
  ) {
    super(s);
    this.setRoot(this);
    this.cps = cps;
    this.determineCpx(registry);
    this.callTrnCpsRootChildren(registry, s);
  }

  transform(): this {
    const direction = this.getRootAst().getDirection();
    const transformClass = [this.cps.getChainString(), direction].join(":");
    const cpsTransform = this.getPlugins().getTransformer(transformClass);
    cpsTransform(this);
    const roots = this.getRootChildren().map((r) => r.transform());
    this.getChildren().forEach((r) => r.transform());
    console.log("s", this.slots, roots);
    // TODO you gotta call the regular children of this root node here.
    return this;
  }

  override serialize(): ISerializedNode[] {
    this.getRootChildren().map((r) => r.serialize());
    const own = super.serialize();
    return own;
  }

  private callTrnCpsRootChildren(
    registry: TrnCpxRegistry,
    s: CommonTransportsConstructorParams,
  ) {
    const TrnCpsRoot = this.getPlugins().getTrnCpsRootNodeConstructor();
    this.cps.getChildren().forEach((c) => {
      const newNode = new TrnCpsRoot(c, registry, s);
      newNode.setRootParent(this);
    });
  }

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

  getTrnCpx(): ITrnCpxNode {
    return this.trnCpx;
  }

  private setTrnCpx(trnCpx: ITrnCpxNode): this {
    this.trnCpx = trnCpx;
    trnCpx.pushChildTrnCpsRootNode(this);
    return this;
  }

  accepts(c: TransformClass, node: ITrnCpsNode): this {
    this.slots.push({
      tClass: c,
      parent: node,
    });
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
