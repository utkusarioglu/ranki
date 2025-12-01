import type {
  ActionMethod,
  ContentDirection,
  IAstNode,
  IAstNodeContext,
  IAstNodeKind,
  IAstNodeNature,
  IAstSpaceNode,
  IAstTokenNode,
  IConfig,
  ICpx,
  IPlugins,
} from "@dqm/package-dqm-api-v2";
import type * as ohm from "ohm-js";
import { assertNotExists } from "../config/hooks.mjs";

type NodeName = string & { type?: "NodeName" };
type TokenNode = IAstTokenNode & {
  left: NodeName;
  right: NodeName;
};

type SpaceNode = IAstSpaceNode & {
  left: NodeName;
  right: NodeName;
};
type OrderNode = IAstNode | TokenNode;
type SubtreeNodes = Map<NodeName, IAstNode>;

export class AstNode implements IAstNode {
  private cpx!: ICpx;
  private plugins!: IPlugins;
  private parent!: IAstNode;
  private children: IAstNode[] = [];
  private direction!: ContentDirection;
  private ohm!: ohm.Node;
  private nature: IAstNodeNature = "literal";
  private orderNodes: OrderNode[] = [];
  private tokenNodes: TokenNode[] = [];
  private spaceNodes: SpaceNode[] = [];
  private subtreeNodes: SubtreeNodes = new Map<NodeName, IAstNode>();
  private childrenNodes: IAstNode[] = [];
  private config!: IConfig;
  private kind!: IAstNodeKind;

  setKind(kind: IAstNodeKind): IAstNode {
    this.kind = kind;
    return this;
  }

  getKind(): IAstNodeKind {
    return this.kind;
  }

  hookConfig(config: IConfig): IAstNode {
    this.config = config;
    return this;
  }

  private getConfig(): IConfig {
    return this.config;
  }

  private getPlugins(): IPlugins {
    return this.plugins;
  }

  // @ts-ignore
  private dummyMethodtoSilenceErrors() {
    console.log(
      this.parent,
      this.direction,
      this.ohm,
      this.nature,
      this.childrenNodes,
    );
  }

  // TODO this needs a lot of work
  newCpx(cpxCallback: (cpx: ICpx) => ICpx): IAstNode {
    const Cpx = this.getPlugins().getCpxConstructor();
    const oldCpx = this.cpx;
    const newCpxMold = new Cpx()
      .hookPlugins(this.getPlugins())
      .hookConfig(this.getConfig())
      .setRootAst(this)
      .setParent(oldCpx);
    const newCpx = cpxCallback(newCpxMold);
    this.cpx = newCpx;
    return this;
  }
  getCpx(): ICpx {
    return this.cpx;
  }

  hookPlugins(plugins: IPlugins): IAstNode {
    this.plugins = plugins;
    return this;
  }

  setParent(parent: IAstNode): IAstNode {
    this.parent = parent;
    return this;
  }

  setCpx(cpx: ICpx): IAstNode {
    this.cpx = cpx;
    return this;
  }

  setDirection(direction: ContentDirection): IAstNode {
    this.direction = direction;
    return this;
  }

  setOhmNode(node: ohm.Node): IAstNode {
    this.ohm = node;
    return this;
  }

  setNature(nature: IAstNodeNature): IAstNode {
    this.nature = nature;
    return this;
  }

  newAst(): IAstNode {
    const newAst = new AstNode()
      .hookConfig(this.getConfig())
      .hookPlugins(this.getPlugins())
      .setParent(this)
      .setCpx(this.cpx);
    this.children.push(newAst);
    return newAst;
  }

  private prepareContext(): IAstNodeContext {
    return { ast: this };
  }

  // TODO
  setChildrenNodes(
    method: ActionMethod,
    required: ohm.Node[],
    alt: ohm.Node[],
  ): IAstNode {
    const context = this.prepareContext();
    const requiredNodes = required.map((n) => n[method](context));
    const altNodes = alt.map((n) => n[method](context));
    console.log({ requiredNodes, altNodes });

    return this;
  }

  pushSpaceNode(
    left: string,
    right: string,
    method: ActionMethod,
    node: ohm.Node,
  ): IAstNode {
    const entry = {
      left,
      right,
      ...node[method](this.prepareContext()),
    };
    this.orderNodes.push(entry);
    this.spaceNodes.push(entry);
    return this;
  }

  pushTokenNode(
    left: string,
    right: string,
    method: ActionMethod,
    node: ohm.Node,
  ): IAstNode {
    const entry = {
      left,
      right,
      ...node[method](this.prepareContext()),
    };
    this.orderNodes.push(entry);
    this.tokenNodes.push(entry);
    return this;
  }

  pushSubtreeNode(name: string, method: ActionMethod, ast: ohm.Node): IAstNode {
    const newNode = ast[method](this.prepareContext());
    this.orderNodes.push(newNode);
    const preexisting = this.subtreeNodes.get(name);
    assertNotExists(preexisting);
    this.subtreeNodes.set(name, newNode);
    return this;
  }
}
