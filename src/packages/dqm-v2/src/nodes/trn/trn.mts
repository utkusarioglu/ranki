import type {
  Chain,
  CommonTransportsConstructorParams,
  DqmConfig,
  IAstNode,
  IAstNodeKind,
  ICps,
  ITrnNode,
  TrnBuilt,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "../common-transports.mjs";
import { verticesCapability } from "../capabilities/vertices.capability.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

export class TrnNode extends CommonTransports implements ITrnNode {
  private vertices = verticesCapability<this, ITrnNode>(this);
  private cps: ICps;
  private children: ITrnNode[][];
  private subtree: ITrnNode[] = [];
  private chain!: Chain;
  private source!: string;
  private kind: IAstNodeKind = "leaf";

  constructor(
    cps: ICps,
    children: ITrnNode[][],
    t: CommonTransportsConstructorParams,
  ) {
    super(t);
    this.cps = cps;
    this.children = children;
  }

  setChain(chain: Chain): this {
    this.chain = chain;
    return this;
  }

  private getCps(): ICps {
    return this.cps;
  }

  getRootAst(): IAstNode {
    const cpx = this.getCps().getCpx();
    assertExists(cpx, { why: "Cps has to exist for the transformer to work" });
    const rootAst = cpx.getRootAst();
    return rootAst;
  }

  // setDirection(direction: ContentDirection): this {
  //   return this;
  // }

  // setHoist(hoist: TfmHoist): this {
  //   return this;
  // }

  getComponentConfig<T>(): T {
    return this.getCps().getComponentConfig();
  }

  getDqmConfig(): DqmConfig {
    return this.getCps().getDqmConfig();
  }

  /**
   * Read the node for the IAstNodeConstructor `children` arg
   */
  getDescendants(): ITrnNode[][] {
    return this.children;
  }

  private setKind(kind: IAstNodeKind) {
    this.kind = kind;
  }

  private getKind(): IAstNodeKind {
    return this.kind;
  }

  // pushChild(child: ITrnNode): this {
  //   return this;
  // }

  setSource(source: string): this {
    this.source = source;
    return this;
  }

  /**
   * Collapses the class to an object. this way it's going to be ready for the
   * render step.
   */
  build(): TrnBuilt[] {
    const kind = this.getKind();
    const component = this.getComponentConfig();
    const dqm = this.getDqmConfig();
    switch (kind) {
      case "parent":
        return [
          {
            kind,
            chain: this.chain,
            component,
            dqm,
            children: this.subtree.map((v) => v.build()).flat(),
          },
        ];
      case "leaf":
        return [
          {
            kind,
            chain: this.chain,
            component,
            dqm,
            source: this.source,
          },
        ];
    }
  }

  /**
   * In case of hoist, this is going to be called to produce a replica of the
   * current node. which will can then be used to hoist the ELEMENT THAT COMES
   * BEFORE.
   */
  clone(): ITrnNode {
    const cloned = new TrnNode(
      this.getCps(),
      this.children,
      this.getTransports(),
    );
    return cloned;
  }

  /**
   * @dev
   * #1 This empty array means that the root of the transform tree is the only
   * source of children. The transform function shouldn't be confused about
   * where to get its children.
   */
  newTrnNode(): ITrnNode {
    this.setKind("parent");
    const cloned = new TrnNode(
      this.getCps(),
      [], // #1
      this.getTransports(),
    );
    cloned.setParent(this);
    if (this.subtree.length > 0) {
      cloned.setPrev(this.subtree.at(-1)!);
    }
    this.subtree.push(cloned);
    return cloned;
  }

  // VERTICES
  setParent = this.vertices.setParent.bind(this.vertices);
  getParent = this.vertices.getParent.bind(this.vertices);
  getNext = this.vertices.getNext.bind(this.vertices);
  getPrev = this.vertices.getPrev.bind(this.vertices);
  setPrev = this.vertices.setPrev.bind(this.vertices);
  setNext = this.vertices.setNext.bind(this.vertices);
  getChildren = this.vertices.getChildren.bind(this.vertices);
  pushChild = this.vertices.pushChild.bind(this.vertices);
}
