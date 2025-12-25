import type * as ohm from "ohm-js";
import type { ICpx } from "../cp/i-cpx.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";
import type { IAstNode } from "../export.types.mjs";

export type PushedNodeDefinition = [IAstNodeRelationship, ohm.Node];

export type IAstNodeActionDict = ohm.ActionDict<IAstNode[] | IAstNode>;

export type ContentDirection = "block" | "inline";
export type IAstNodeNature = "literal" | "synthetic";
export type ActionMethod = string & { type?: "OhmActionMethod" };
export type IAstNodeKind = "parent" | "leaf";

export type CpxFuncParam = (cpx: ICpx) => ICpx;

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

export type IAstNodeRelationship = "space" | "token" | "node";

export type IAstNodeConstructor = new (
  c: CommonTransportsConstructorParams,
) => IAstNode;

export type NodeName = string & { type?: "NodeName" };
export type CreatorName = string & { type?: "OhmJsCreatorName" };

export type SubtreeNodes = IAstNode[] & { type?: "SubtreeNodes" };
export type SpaceNodes = IAstNode[] & { type?: "SpaceNodes" };
export type TokenNodes = IAstNode[] & { type?: "TokenNodes" };
export type ChildrenNodes = IAstNode[] & { type?: "ChildrenNodes" };

export type AstSourceString = string & { type?: "AstSourceString" };
export type CreationMethod = string & { type?: "CreationMethod" };

/**
 * @dev
 * #1 This property's type can be anything depending on what decoder is defined
 * for the node.
 */
export interface AstSourceViewCommon {
  type: string;
  raw: string;
}

export type AstSourceView<Custom = any> = AstSourceViewCommon &
  AstSourceViewAdditional<Custom>;

export type AstSourceViewAdditional<Value = any> = {
  subType?: string;
  value: Value;
};

export type AstSourceViewDecoderCustom<Value> = (
  input: string,
) => AstSourceViewAdditional<Value>;

// export interface IAstNode
//   extends IAstNodeCounterCapabilities,
//     IAstNodeOhmCapabilities,
//     IAstNodeSemanticCapabilities,
//     IAstNodeSyntaxCapabilities,
//     IAstNodeVerticesCapabilities,
//     IAstNodeViewCapabilities {
//   /**
//    * This is supposed to create a new cpx and then let the node build it
//    * inside the callback:
//    *
//    * .newCpx(cpx => cpx
//    *    .setDefinition(...)
//    *    .setStartRule(...)
//    *  )
//    */
//   newCpx(cpxCallback: CpxFuncParam): this;
//   newAst(ohm: ohm.Node): IAstNode;
//   newParam(ohm: ohm.Node): IParam;
//   // setCpx(cpx: ICpx): this;
//   getCpx(): ICpx | null;
// }

// export interface IAstNodeCounterCapabilities {
//   setChildIndex(n: CounterStat): this;
//   getChildIndex(): CounterStat;
//   getInlineDepth(): CounterStat;
//   getBlockDepth(): CounterStat;
// }

// export interface IAstNodeOhmCapabilities {
//   getSourceString(): AstSourceString;
//   getCreator(): CreatorName;
// }

// export interface IAstNodeSemanticCapabilities {
//   getKind(): IAstNodeKind;

//   /**
//    * Associates a token with its intended meaning. Such as `assignment` for `=`
//    * in params.
//    */
//   setMeaning(meaning: string): this;
//   getMeaning(): string;

//   /**
//    * Defines the method in the action dictionary that was called to create this node
//    */
//   setCreationMethod(method: CreationMethod): this;
//   getCreationMethod(): CreationMethod;
//   setDirection(direction: ContentDirection): this;
//   getDirection(): ContentDirection;

//   setRelationship(relationship: IAstNodeRelationship): this;

//   /**
//    * literal for nodes created by what's in the course dqm, synthetic
//    * for nodes created through processes such as wrapping words with
//    * bold because of *<word>*
//    */
//   setNature(nature: IAstNodeNature): this;
//   getNature(): IAstNodeNature;
//   getRelationship(): IAstNodeRelationship;
// }

// export interface IAstNodeSyntaxCapabilities {
//   getChildrenNodes(): ChildrenNodes;
//   getTokenNodes(): TokenNodes;
//   getSpaceNodes(): SpaceNodes;
//   getSubtreeNodes(): SubtreeNodes;
//   findSubtreeNodeByCreator(creator: CreatorName): IAstNode | undefined;
//   findTokenNodeByCreator(creator: CreatorName): IAstNode | undefined;
//   findSpaceNodeByCreator(creator: CreatorName): IAstNode | undefined;
//   getIgnoredNodes(): ohm.Node[];
//   pushNodes(...nodes: PushedNodeDefinition[]): this;
//   pushIgnoredNodes(...nodes: ohm.Node[]): this;
// }

// export interface IAstNodeVerticesCapabilities {
//   setParent(parent: IAstNode): this;
//   getParent(): IAstNode | null;
//   getPrev(): IAstNode | null;
//   getNext(): IAstNode | null;
//   setPrev(prev: IAstNode): this;
//   setNext(next: IAstNode): this;
//   getChildren(): IAstNode[];
// }

// export interface IAstNodeViewCapabilities {
//   getLeafView<T = any>(): AstSourceView<T>;
//   setLeafViewDecoder(
//     typeName: string,
//     decoder: AstSourceViewDecoderCustom<any>,
//   ): this;
// }
