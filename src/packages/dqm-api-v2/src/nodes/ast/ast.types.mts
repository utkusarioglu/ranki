import type { IConfig, ICpx, IPlugins } from "../../export.types.mjs";
import type * as ohm from "ohm-js";

export type ContentDirection = "block" | "inline";
export type IAstNodeNature = "literal" | "synthetic";
export type ActionMethod = string & { type?: "OhmActionMethod" };
export type IAstNodeKind = "parent" | "leaf";

type CpxFuncParam = (cpx: ICpx) => ICpx;

export type IAstNodeContext = {
  ast: IAstNode;
};

export interface IAstSpaceNode {
  type: "block" | "clearance" | "nl" | "whitespace";
  raw: string;
}

export interface IAstTokenNode {
  type: string;
  raw: string;
}

export type IAstNodeRelationship = "child" | "subtree" | "space" | "token";

export type IAstNodeConstructor = new (
  plugins: IPlugins,
  config: IConfig,
) => ICpx;

export type NodeName = string & { type?: "NodeName" };
export type CreatorName = string & { type?: "OhmJsCreatorName" };

export type SubtreeNodes = IAstNode[] & { type?: "SubtreeNodes" };
export type SpaceNodes = IAstNode[] & { type?: "SpaceNodes" };
export type TokenNodes = IAstNode[] & { type?: "TokenNodes" };
export type ChildrenNodes = IAstNode[] & { type?: "ChildrenNodes" };

export type AstSourceString = string & { type?: "AstSourceString" };
export type CreationMethod = string & { type?: "CreationMethod" };
export interface IAstNode {
  setKind(kind: IAstNodeKind): IAstNode;
  getKind(): IAstNodeKind;
  newAst(): IAstNode;
  setParent(parent: IAstNode): IAstNode;
  setCpx(cpx: ICpx): IAstNode;
  getCpx(): ICpx;
  getSourceString(): AstSourceString;
  getChildrenNodes(): ChildrenNodes;
  getType(): IAstNodeRelationship;
  getPrev(): IAstNode | null;
  getNext(): IAstNode | null;
  getSubtreeNodes(): SubtreeNodes;
  getCreator(): CreatorName;
  setPrev(prev: IAstNode): IAstNode;
  setNext(next: IAstNode): IAstNode;
  // setRelationship(type: IAstNodeRelationship): IAstNode;
  setRelationship(relationship: IAstNodeRelationship): IAstNode;
  /**
   * Defines the method in the action dictionary that was called to create this node
   */
  setCreationMethod(method: CreationMethod): IAstNode;
  getCreationMethod(): CreationMethod;
  /**
   * This is supposed to create a new cpx and then let the node build it
   * inside the callback:
   *
   * .newCpx(cpx => cpx
   *    .setDefinition(...)
   *    .setStartRule(...)
   *  )
   */
  newCpx(cpxCallback: CpxFuncParam): IAstNode;
  /**
   * If `newCpx` works, these three won't be needed
   */

  setDirection(direction: ContentDirection): IAstNode;
  getDirection(): ContentDirection;

  /**
   * this will set things like the source and the creatorName
   */
  setOhmNode(node: ohm.Node): IAstNode;

  /**
   * literal for nodes created by what's in the course dqm, synthetic
   * for nodes created through processes such as wrapping words with
   * bold because of *<word>*
   */
  setNature(nature: IAstNodeNature): IAstNode;

  /**
   * The order of the rest of the methods is important as they are placed in an array,
   * in turn their sources end up reconstructing the source
   */
  // setChildrenNodes(
  //   required: ohm.Node[],
  //   zipped?: ohm.Node[],
  //   method?: ActionMethod,
  // ): IAstNode;
  /**
   *  these children methods could be combined into one with some clever param shape
   */
  // setChildrenListOf(method: ActionMethod, alt: ohm.Node[]): IAstNode;
  // pushSpaceNode(
  //   left: ohm.Node | null,
  //   right: ohm.Node | null,
  //   node: ohm.Node,
  //   method?: ActionMethod,
  // ): IAstNode;
  // pushTokenNode(
  //   left: ohm.Node | null,
  //   right: ohm.Node | null,
  //   node: ohm.Node,
  //   method?: ActionMethod,
  // ): IAstNode;
  // pushSubtreeNode(ast: ohm.Node, method?: ActionMethod): IAstNode;

  pushNodes(...nodes: PushedNodeDefinition[]): IAstNode;
}

// export interface PushedNodeDefinition {
//   relationship: "subtree" | "child" | "space" | "token";
//   node: ohm.Node;
// }

export type PushedNodeDefinition = [IAstNodeRelationship, ohm.Node];

// ]
//   relationship: "subtree" | "child" | "space" | "token";
//   node: ohm.Node;
// }
