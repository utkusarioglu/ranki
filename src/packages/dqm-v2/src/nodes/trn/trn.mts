import type {
  Chain,
  CommonTransportsConstructorParams,
  DqmConfig,
  IAstNode,
  IAstNodeKind,
  ICps,
  ICpx,
  ITrnNode,
  ISerializedNode,
} from "@dqm/package-dqm-api-v2";
import { CommonTransports } from "../common-transports.mjs";
import { verticesCapability } from "../capabilities/vertices.capability.mjs";
import { assertExists, rejectValues } from "@dqm/package-dqm-utils";

export class TrnNode extends CommonTransports implements ITrnNode {
  private vertices = verticesCapability<this, ITrnNode>(this);
  // private cpx: ICpx;
  private children!: ITrnNode[];
  private ast: IAstNode;
  private subtree: ITrnNode[] = [];
  private chain!: Chain;
  private source!: string;
  private kind: IAstNodeKind = "leaf";

  constructor(
    // cpx: ICpx,
    ast: IAstNode,
    // children: ITrnNode[][],
    t: CommonTransportsConstructorParams,
  ) {
    super(t);
    // this.cpx = cpx;
    this.ast = ast;
    // this.children = children;
    this.processTransform();
  }

  private processTransform() {
    const transformer = this.getPlugins().getTransformer(
      this.getAst().getCreator(),
    );
    transformer(this);
  }

  setChain(chain: Chain): this {
    this.chain = chain;
    return this;
  }

  private getCpx(): ICpx {
    const cpx = this.getAst().getCpx();
    assertExists(cpx, { why: "Working ast nodes all need to have a cpx" });
    return cpx;
  }

  getAst(): IAstNode {
    return this.ast;
  }

  private getLeafCps(): ICps {
    const cpx = this.getCpx();
    return cpx.getLeafCps();
  }

  // private getRootAst(): IAstNode {
  //   const cpx = this.getCpx();
  //   return cpx.getRootAst();
  // }

  // setDirection(direction: ContentDirection): this {
  //   return this;
  // }

  // setHoist(hoist: TfmHoist): this {
  //   return this;
  // }

  getComponentConfig<T>(): T {
    return this.getLeafCps().getComponentConfig();
  }

  getDqmConfig(): DqmConfig {
    return this.getLeafCps().getDqmConfig();
  }

  /**
   * Read the node for the IAstNodeConstructor `children` arg
   */
  getDescendants(): ITrnNode[] {
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

  @rejectValues(undefined)
  private getChain() {
    return this.chain;
  }

  /**
   * Collapses the class to an object. this way it's going to be ready for the
   * render step.
   */
  build(): ISerializedNode[] {
    const kind = this.getKind();
    const component = this.getComponentConfig();
    const dqm = this.getDqmConfig();
    const chain = this.getChain();
    switch (kind) {
      case "parent":
        return [
          {
            kind,
            chain,
            component,
            dqm,
            children: this.subtree.map((v) => v.build()).flat(),
          },
        ];
      case "leaf":
        return [
          {
            kind,
            chain,
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
      this.getAst(),
      // this.children,
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
  newTrnNode(ast: IAstNode): ITrnNode {
    this.setKind("parent");
    const cloned = new TrnNode(
      ast,
      // [], // #1
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
