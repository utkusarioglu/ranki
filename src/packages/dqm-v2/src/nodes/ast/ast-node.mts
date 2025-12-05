import type {
  AstSourceString,
  ContentDirection,
  IAstNode,
  IAstNodeContext,
  IAstNodeKind,
  IAstNodeNature,
  ICpx,
  CreatorName,
  PushedNodeDefinition,
  IAstNodeRelationship,
  TokenNodes,
  SpaceNodes,
  SubtreeNodes,
  ChildrenNodes,
  CreationMethod,
  IParam,
  AstSourceView,
  AstSourceViewDecoder,
  AstSourceViewBase,
} from "@dqm/package-dqm-api-v2";
import type * as ohm from "ohm-js";
import {
  assertArrayNotEmpty,
  assertLeaf,
  // assertParent,
  dependsOn,
  DqmError,
  rejectValues,
} from "@dqm/package-utils";
import { CommonTransports } from "../common-transports.mjs";
import { Param } from "../param/param.mjs";

export type WorkedNodeDefinition = [IAstNodeRelationship, ohm.Node[]];
export type LeafDecoder = {
  type: string;
  decoder: AstSourceViewDecoder;
};

export class AstNode extends CommonTransports implements IAstNode {
  private cpx!: ICpx;
  private parent!: IAstNode;
  private children: IAstNode[] = [];
  private direction!: ContentDirection;
  private ohm!: ohm.Node;
  private nature: IAstNodeNature = "literal";
  private orderNodes: IAstNode[] = [];
  private tokenNodes: TokenNodes = [];
  private spaceNodes: SpaceNodes = [];
  private subtreeNodes: SubtreeNodes = [];
  private childrenNodes: ChildrenNodes = [];
  private ignoredNodes: ohm.Node[] = [];
  private kind: IAstNodeKind = "leaf";
  private prev: IAstNode | null = null;
  private next: IAstNode | null = null;
  private relationship!: IAstNodeRelationship;
  private creationMethod!: string;
  private leafDecoder!: LeafDecoder;

  private defaultLeafDecoder(): LeafDecoder {
    return {
      type: "string",
      decoder: (raw: string) => ({
        type: "string",
        raw,
      }),
    };
  }

  // @ts-ignore
  private dummyMethodToSilenceErrors() {
    console.log(
      this.parent,
      this.direction,
      this.ohm,
      this.nature,
      this.childrenNodes,
    );
  }

  // TODO this needs a lot of work
  newCpx(cpxCallback: (cpx: ICpx) => ICpx): this {
    const Cpx = this.getPlugins().getCpxConstructor();
    const oldCpx = this.cpx;
    const newCpxMold = new Cpx(this.getTransports())
      .setRootAst(this)
      // !FIX this setting the parent like this is faulty it clashes with paused container climbing up
      .setParent(oldCpx);
    this.cpx = cpxCallback(newCpxMold);
    return this;
  }

  newAst(ohm: ohm.Node): IAstNode {
    const newAst = new AstNode(this.getTransports())
      .setParent(this)
      .setOhmNode(ohm)
      .setCpx(this.getCpx())
      .setDirection(this.getDirection());
    this.children.push(newAst);
    return newAst;
  }

  newParam(ohm: ohm.Node): IParam {
    const newParam = new Param(this.getTransports());
    newParam
      .setParent(this)
      .setOhmNode(ohm)
      .setCpx(this.getCpx())
      .setDirection(this.getDirection());
    this.children.push(newParam);
    return newParam;
  }

  /**
   * @dev
   * #1 The check for leafDecoder relates to only leaves being able to define a
   * decoder. If a decoder is defined, the node shouldn't be able to become a
   * parent. Which means, pushing nodes to the node shouldn't be possible.
   *
   * #2 This is experimental. The aim is to see if the `subtree` and `child`
   * distinction can be made through the unique id of CPS
   * */
  @dependsOn("kind")
  pushNodes(...nodeSetRaw: PushedNodeDefinition[]): this {
    assertArrayNotEmpty(nodeSetRaw, { method: "pushNodes" });
    // #1
    if (this.leafDecoder) {
      throw new DqmError("ATTEMPTING_TO_PUSH_NODES_TO_LEAF", {
        nodeSetRaw,
        decoder: this.leafDecoder,
      });
    }
    this.setKind("parent");

    const areIter = nodeSetRaw.map((n) => n[1].isIteration());
    const isIter = areIter.some((v) => v === true);
    const inconsistentIter = isIter && areIter.some((v) => v !== true);
    if (inconsistentIter) {
      throw new DqmError("INCONSISTENT_ITERATOR_NODES", {
        nodeSetRaw,
        areIter,
      });
    }
    const nodeSet: WorkedNodeDefinition[] = isIter
      ? nodeSetRaw.map(([relationship, nodes]) => [
          relationship,
          nodes.children,
        ])
      : nodeSetRaw.map(([relationship, nodes]) => [relationship, [nodes]]);

    if (nodeSet.some(([_, nodes]) => nodes.length !== nodeSet[0][1].length)) {
      throw new DqmError("INCONSISTENT_ZIP_MEMBER_HEIGHTS", { nodeSet });
    }
    const context = this.prepareContext();

    [...Array.from(nodeSet[0][1].keys())].forEach((i) => {
      nodeSet.forEach(([relationship, nodes]) => {
        let method;
        switch (relationship) {
          case "node":
          case "child":
          case "subtree":
            // #2
            // case "subtree":
            // case "child":
            method = "node";
            break;
          default:
            method = relationship;
        }
        const parsedRaw = nodes[i][method](context) as IAstNode | IAstNode[];
        const parsedList = Array.isArray(parsedRaw) ? parsedRaw : [parsedRaw];
        parsedList.forEach((parsed) => {
          parsed.setRelationship(relationship).setCreationMethod(method);
          if (this.orderNodes.length) {
            const prevNode = this.orderNodes.at(-1)!;
            parsed.setPrev(prevNode);
            prevNode.setNext(parsed);
          }
          this.orderNodes.push(parsed);
          switch (relationship) {
            // @ts-ignore
            case "child":
            // @ts-ignore
            case "subtree":
            case "node":
              if (
                this.getCpx().getId().getUnique() ===
                parsed.getCpx().getId().getUnique()
              ) {
                this.subtreeNodes.push(parsed);
              } else {
                this.childrenNodes.push(parsed);
              }
              break;
            // #2
            // case "subtree":
            //   this.subtreeNodes.push(parsed);
            //   break;
            // case "child":
            //   this.childrenNodes.push(parsed);
            //   break;
            case "space":
              this.spaceNodes.push(parsed);
              break;
            case "token":
              this.tokenNodes.push(parsed);
          }
        });
      });
    });
    return this;
  }

  /**
   * @dev
   * #1 I simply don't mind TS1270 here
   */
  // @ts-expect-error #1
  @dependsOn("kind", "ohm")
  getLeafView<T extends AstSourceViewBase>(): AstSourceView<T> {
    assertLeaf(this, {});
    const raw = this.ohm.sourceString;
    try {
      if (this.leafDecoder) {
        // @ts-expect-error #1
        return {
          type: this.leafDecoder.type,
          raw,
          ...this.leafDecoder.decoder(raw),
        };
      } else {
        const decoder = this.defaultLeafDecoder();
        // @ts-expect-error #1
        return decoder.decoder(raw);
      }
    } catch (e) {
      throw new DqmError("AST_DECODER_FAILURE", {
        error: e,
        raw,
        decoder: this.leafDecoder,
      });
    }
  }

  @dependsOn("kind")
  setLeafViewDecoder<T extends AstSourceViewBase>(
    type: string,
    decoder: AstSourceViewDecoder<T>,
  ): this {
    assertLeaf(this, { type, decoder });
    this.leafDecoder = {
      type,
      decoder,
    };
    return this;
  }

  setCreationMethod(method: string): this {
    this.creationMethod = method;
    return this;
  }

  getCreationMethod(): CreationMethod {
    return this.creationMethod;
  }

  setRelationship(type: IAstNodeRelationship): this {
    this.relationship = type;
    return this;
  }

  getRelationship(): IAstNodeRelationship {
    return this.relationship;
  }

  setPrev(prev: IAstNode): this {
    this.prev = prev;
    return this;
  }

  getPrev(): IAstNode | null {
    return this.prev;
  }

  setNext(next: IAstNode): this {
    this.next = next;
    return this;
  }

  getNext(): IAstNode | null {
    return this.next;
  }

  @rejectValues(undefined)
  getCreator(): CreatorName {
    return this.ohm.ctorName;
  }

  getSubtreeNodes(): IAstNode[] {
    return this.subtreeNodes;
  }

  getChildrenNodes(): IAstNode[] {
    return this.childrenNodes;
  }

  private setKind(kind: IAstNodeKind): this {
    this.kind = kind;
    return this;
  }

  @rejectValues(undefined)
  getKind(): IAstNodeKind {
    return this.kind;
  }

  @rejectValues(undefined)
  getSourceString(): AstSourceString {
    return this.ohm.sourceString;
  }

  @rejectValues(undefined)
  getCpx(): ICpx {
    return this.cpx;
  }

  setParent(parent: IAstNode): this {
    this.parent = parent;
    return this;
  }

  setCpx(cpx: ICpx): this {
    this.cpx = cpx;
    return this;
  }

  setDirection(direction: ContentDirection): this {
    this.direction = direction;
    return this;
  }

  private setOhmNode(node: ohm.Node): this {
    this.ohm = node;
    return this;
  }

  setNature(nature: IAstNodeNature): this {
    this.nature = nature;
    return this;
  }

  @rejectValues(undefined)
  getDirection(): ContentDirection {
    return this.direction;
  }

  pushIgnoredNodes(...nodes: ohm.Node[]): this {
    this.ignoredNodes.push(...nodes);
    return this;
  }

  getIgnoredNodes(): ohm.Node[] {
    return this.ignoredNodes;
  }

  private prepareContext(): IAstNodeContext {
    return { ast: this };
  }
}
