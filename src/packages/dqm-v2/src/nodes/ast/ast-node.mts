import type {
  ActionMethod,
  AstSourceString,
  ContentDirection,
  IAstNode,
  IAstNodeContext,
  IAstNodeKind,
  IAstNodeNature,
  IAstSpaceNode,
  IAstTokenNode,
  NodeName,
  ICpx,
  CreatorName,
} from "@dqm/package-dqm-api-v2";
import type * as ohm from "ohm-js";
import { assertNotExists, assertParent } from "@dqm/package-utils";
import { CommonTransports } from "../common-transports.mjs";

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

export class AstNode extends CommonTransports implements IAstNode {
  private cpx!: ICpx;
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
  private kind!: IAstNodeKind;

  getCreator(): CreatorName {
    return this.ohm.ctorName;
  }

  getSubtreeNodes(): Record<NodeName, IAstNode> {
    return Object.fromEntries(this.subtreeNodes);
  }

  getChildrenNodes(): IAstNode[] {
    return this.childrenNodes;
  }

  setKind(kind: IAstNodeKind): IAstNode {
    this.kind = kind;
    return this;
  }

  getKind(): IAstNodeKind {
    return this.kind;
  }

  getSourceString(): AstSourceString {
    return this.ohm.sourceString;
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
    const newCpxMold = new Cpx(this.getPlugins(), this.getConfig())
      .setRootAst(this)
      .setParent(oldCpx);
    this.cpx = cpxCallback(newCpxMold);
    return this;
  }
  getCpx(): ICpx {
    return this.cpx;
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
    const newAst = new AstNode(this.getPlugins(), this.getConfig())
      .setParent(this)
      .setCpx(this.getCpx());
    this.children.push(newAst);
    return newAst;
  }

  private prepareContext(): IAstNodeContext {
    return { ast: this };
  }

  // TODO
  setChildrenNodes(
    required: ohm.Node[],
    _alt: ohm.Node[] = [],
    method: ActionMethod = "node",
  ): IAstNode {
    assertParent(this, { obj: this });
    const context = this.prepareContext();
    const requiredNodes = required.map((n) => n[method](context));
    // const altNodes = alt.map((n) => n[method](context));
    this.children.push(...requiredNodes);
    return this;
  }

  pushSpaceNode(
    left: ohm.Node | null,
    right: ohm.Node | null,
    node: ohm.Node,
    method: ActionMethod = "space",
  ): IAstNode {
    assertParent(this, { obj: this });
    const entry = {
      left: left?.ctorName || null,
      right: right?.ctorName || null,
      ...node[method](this.prepareContext()),
    };
    this.orderNodes.push(entry);
    this.spaceNodes.push(entry);
    return this;
  }

  pushTokenNode(
    left: ohm.Node | null,
    right: ohm.Node | null,
    node: ohm.Node,
    method: ActionMethod = "token",
  ): IAstNode {
    assertParent(this, { obj: this });
    const entry = {
      left: left?.ctorName || null,
      right: right?.ctorName || null,
      ...node[method](this.prepareContext()),
    };
    this.orderNodes.push(entry);
    this.tokenNodes.push(entry);
    return this;
  }

  pushSubtreeNode(ast: ohm.Node, method: ActionMethod = "node"): IAstNode {
    assertParent(this, { obj: this });
    const name = ast.ctorName;
    const newNode = ast[method](this.prepareContext());
    this.orderNodes.push(newNode);
    const preexisting = this.subtreeNodes.get(name);
    assertNotExists(preexisting, { preexisting, name, method, ast });
    this.subtreeNodes.set(name, newNode);
    return this;
  }
}
