import type { IConfig, ICpx, IParam, IPlugins } from "../../export.types.mjs";
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

export interface AstSourceViewCommon {
  type: string;
  raw: string;
}

export type AstSourceView<Custom extends AstSourceViewBase> =
  AstSourceViewCommon & Custom;

export type AstSourceViewBase = Record<string, any>;

export type AstSourceViewDecoder<
  Custom extends AstSourceViewBase = AstSourceViewBase,
> = (input: string) => Custom;

export interface IAstNode {
  setKind(kind: IAstNodeKind): this;
  getKind(): IAstNodeKind;
  newAst(ohm: ohm.Node): IAstNode;
  newParam(ohm: ohm.Node): IParam;
  setParent(parent: IAstNode): this;
  setCpx(cpx: ICpx): this;
  getCpx(): ICpx;
  getSourceString(): AstSourceString;
  getSourceView<T extends AstSourceViewBase>(): AstSourceView<T>;
  setSourceViewDecoder<T extends AstSourceViewBase>(
    typeName: string,
    decoder: AstSourceViewDecoder<T>,
  ): this;
  getChildrenNodes(): ChildrenNodes;
  getRelationship(): IAstNodeRelationship;
  getPrev(): IAstNode | null;
  getNext(): IAstNode | null;
  getSubtreeNodes(): SubtreeNodes;
  getCreator(): CreatorName;
  setPrev(prev: IAstNode): this;
  setNext(next: IAstNode): this;
  setRelationship(relationship: IAstNodeRelationship): this;
  /**
   * Defines the method in the action dictionary that was called to create this node
   */
  setCreationMethod(method: CreationMethod): this;
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
  newCpx(cpxCallback: CpxFuncParam): this;
  setDirection(direction: ContentDirection): this;
  getDirection(): ContentDirection;

  /**
   * this will set things like the source and the creatorName
   */
  // setOhmNode(node: ohm.Node): this;

  /**
   * literal for nodes created by what's in the course dqm, synthetic
   * for nodes created through processes such as wrapping words with
   * bold because of *<word>*
   */
  setNature(nature: IAstNodeNature): this;
  pushNodes(...nodes: PushedNodeDefinition[]): this;
  pushIgnoredNodes(...nodes: ohm.Node[]): this;
}
export type PushedNodeDefinition = [IAstNodeRelationship, ohm.Node];

export type IAstNodeActionDict = ohm.ActionDict<IAstNode[] | IAstNode>;
