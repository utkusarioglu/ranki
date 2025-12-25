import type * as ohm from "ohm-js";
import type { ICpx } from "../../cp/i-cpx.types.mjs";
import type { IAstParamNode } from "../param/export.types.mjs";
import type { CounterStat } from "./ast-counter.types.mjs";
import type {
  AstSourceString,
  AstSourceView,
  AstSourceViewDecoderCustom,
  ChildrenNodes,
  ContentDirection,
  CpxFuncParam,
  CreationMethod,
  CreatorName,
  IAstNodeKind,
  IAstNodeNature,
  IAstNodeRelationship,
  PushedNodeDefinition,
  SpaceNodes,
  SubtreeNodes,
  TokenNodes,
} from "./i-ast-node.types.mjs";

export interface IAstNode
  extends IAstNodeCounterCapabilities,
    IAstNodeOhmCapabilities,
    IAstNodeSemanticCapabilities,
    IAstNodeSyntaxCapabilities,
    IAstNodeVerticesCapabilities,
    IAstNodeViewCapabilities {
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
  newAst(ohm: ohm.Node): IAstNode;
  newParam(ohm: ohm.Node): IAstParamNode;
  getCpx(): ICpx | null;
}

export interface IAstNodeCounterCapabilities {
  setChildIndex(n: CounterStat): this;
  getChildIndex(): CounterStat;
  getInlineDepth(): CounterStat;
  getBlockDepth(): CounterStat;
}

export interface IAstNodeOhmCapabilities {
  getSourceString(): AstSourceString;
  getCreator(): CreatorName;
}

export interface IAstNodeSemanticCapabilities {
  getKind(): IAstNodeKind;

  /**
   * Associates a token with its intended meaning. Such as `assignment` for `=`
   * in params.
   */
  setMeaning(meaning: string): this;
  getMeaning(): string;

  /**
   * Defines the method in the action dictionary that was called to create this node
   */
  setCreationMethod(method: CreationMethod): this;
  getCreationMethod(): CreationMethod;
  setDirection(direction: ContentDirection): this;
  getDirection(): ContentDirection;

  setRelationship(relationship: IAstNodeRelationship): this;

  /**
   * literal for nodes created by what's in the course dqm, synthetic
   * for nodes created through processes such as wrapping words with
   * bold because of *<word>*
   */
  setNature(nature: IAstNodeNature): this;
  getNature(): IAstNodeNature;
  getRelationship(): IAstNodeRelationship;
}

export interface IAstNodeSyntaxCapabilities {
  getChildrenNodes(): ChildrenNodes;
  getTokenNodes(): TokenNodes;
  getSpaceNodes(): SpaceNodes;
  getSubtreeNodes(): SubtreeNodes;
  findSubtreeNodeByCreator(creator: CreatorName): IAstNode | undefined;
  findTokenNodeByCreator(creator: CreatorName): IAstNode | undefined;
  findSpaceNodeByCreator(creator: CreatorName): IAstNode | undefined;
  getIgnoredNodes(): ohm.Node[];
  pushNodes(...nodes: PushedNodeDefinition[]): this;
  pushIgnoredNodes(...nodes: ohm.Node[]): this;
}

export interface IAstNodeVerticesCapabilities {
  setParent(parent: IAstNode): this;
  getParent(): IAstNode | null;
  getPrev(): IAstNode | null;
  getNext(): IAstNode | null;
  setPrev(prev: IAstNode): this;
  setNext(next: IAstNode): this;
  getChildren(): IAstNode[];
}

export interface IAstNodeViewCapabilities {
  getLeafView<T = any>(): AstSourceView<T>;
  setLeafViewDecoder(
    typeName: string,
    decoder: AstSourceViewDecoderCustom<any>,
  ): this;
}
