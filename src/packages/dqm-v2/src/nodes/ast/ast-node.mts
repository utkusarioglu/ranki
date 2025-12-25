import type {
  IAstNode,
  ICpx,
  PushedNodeDefinition,
  IAstParamNode,
  AstSourceView,
  CpxFuncParam,
} from "@dqm/package-dqm-api-v2";
import type * as ohm from "ohm-js";
import { assertNotExists, rejectValues } from "@dqm/package-dqm-utils";
import { CommonTransports } from "../common-transports.mjs";
import { verticesCapability } from "./capabilities/vertices.capability.mjs";
import { syntaxCapability } from "./capabilities/syntax.capability.mjs";
import { semanticCapability } from "./capabilities/semantic.capability.mjs";
import { ohmCapability } from "./capabilities/ohm.capability.mjs";
import { viewCapability } from "./capabilities/view.capability.mjs";
import { counterCapability } from "./capabilities/counter.capability.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

export class AstNode extends CommonTransports implements IAstNode {
  private semantic = semanticCapability(this);
  private vertices = verticesCapability(this);
  private syntax = syntaxCapability(this);
  private ohm = ohmCapability(this);
  private view = viewCapability(this);
  private counter = counterCapability(this);
  private cpx: ICpx | null = null;

  // TODO this needs a lot of work
  newCpx(cpxCallback: CpxFuncParam): this {
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
    return this.newChild(this.getPlugins().getAstNodeConstructor(), ohm);
  }

  newParam(ohm: ohm.Node): IAstParamNode {
    return this.newChild(this.getPlugins().getParamConstructor(), ohm);
  }

  private postCreationActions() {
    if (this.vertices.getChildren().length) {
      return;
    }
    this.counter.incrementDirection(this.getDirection());
  }

  /**
   * @dev
   * #1 When `newChild` is called, it is assumed that the parent's creation is
   * already complete. This allows us to do calculations such as
   */
  private newChild(ChildConstructor: any, ohm: ohm.Node) {
    //#1
    const childrenCount = this.vertices.getChildren().length;
    if (!childrenCount) {
      this.postCreationActions();
    }

    const child = new ChildConstructor(this.getTransports());
    child
      .setParent(this)
      .setOhmNode(ohm)
      .setCpx(this.getCpx())
      .setChildIndex(childrenCount)
      .setInheritedCounters(this.counter.getInheritedCounters())
      .setDirection(this.getDirection());
    this.vertices.pushChild(child);
    return child;
  }

  @rejectValues(undefined)
  getCpx(): ICpx | null {
    return this.cpx;
  }

  setCpx(cpx: ICpx): this {
    this.cpx = cpx;
    return this;
  }

  // COUNTER
  setChildIndex = this.counter.setChildIndex.bind(this.counter);
  getChildIndex = this.counter.getChildIndex.bind(this.counter);
  setInheritedCounters = this.counter.setInheritedCounters.bind(this.counter);
  getInlineDepth = this.counter.getInlineDepth.bind(this.counter);
  getBlockDepth = this.counter.getBlockDepth.bind(this.counter);

  // VIEW
  getLeafView<T = any>(): AstSourceView<T> {
    const raw = this.getSourceString();
    return this.view.getLeafView(raw);
  }
  setLeafViewDecoder = this.view.setLeafViewDecoder.bind(this.view);

  // OHM
  setOhmNode = this.ohm.setOhmNode.bind(this.ohm);
  getSourceString = this.ohm.getSourceString.bind(this.ohm);
  getCreator = this.ohm.getCreator.bind(this.ohm);

  // SEMANTIC
  setDirection = this.semantic.setDirection.bind(this.semantic);
  getKind = this.semantic.getKind.bind(this.semantic);
  setNature = this.semantic.setNature.bind(this.semantic);
  getNature = this.semantic.getNature.bind(this.semantic);
  setMeaning = this.semantic.setMeaning.bind(this.semantic);
  getDirection = this.semantic.getDirection.bind(this.semantic);
  getMeaning = this.semantic.getMeaning.bind(this.semantic);
  getCreationMethod = this.semantic.getCreationMethod.bind(this.semantic);
  setCreationMethod = this.semantic.setCreationMethod.bind(this.semantic);
  setRelationship = this.semantic.setRelationship.bind(this.semantic);
  getRelationship = this.semantic.getRelationship.bind(this.semantic);

  // VERTICES
  setParent = this.vertices.setParent.bind(this.vertices);
  getParent = this.vertices.getParent.bind(this.vertices);
  getNext = this.vertices.getNext.bind(this.vertices);
  getPrev = this.vertices.getPrev.bind(this.vertices);
  setPrev = this.vertices.setPrev.bind(this.vertices);
  setNext = this.vertices.setNext.bind(this.vertices);
  getChildren = this.vertices.getChildren.bind(this.vertices);

  // NODES
  /**
   * @dev
   * #1 The check for leafDecoder relates to only leaves being able to define a
   * decoder. If a decoder is defined, the node shouldn't be able to become a
   * parent. Which means, pushing nodes to the node shouldn't be possible.
   *
   * #2 This is experimental. The aim is to see if the `subtree` and `child`
   * distinction can be made through the unique id of CPS
   * */
  pushNodes(...nodeSetRaw: PushedNodeDefinition[]): this {
    // #1
    assertNotExists(this.view.getDefinedLeafDecoder(), {
      why: "Leaf nodes cannot have children nodes",
      details: {
        nodeSetRaw,
      },
    });
    this.semantic.setKind("parent");
    const cpx = this.getCpx();
    assertExists(cpx, {
      why: "Pushing a child expects an already defined cpx",
    });
    const cpxUnique = cpx.getUnique();
    this.syntax.pushNodes(nodeSetRaw, cpxUnique);
    return this;
  }

  getChildrenNodes = this.syntax.getChildrenNodes.bind(this.syntax);
  getTokenNodes = this.syntax.getTokenNodes.bind(this.syntax);
  getSpaceNodes = this.syntax.getSpaceNodes.bind(this.syntax);
  getSubtreeNodes = this.syntax.getSubtreeNodes.bind(this.syntax);
  findSubtreeNodeByCreator = this.syntax.findSubtreeNodeByCreator.bind(
    this.syntax,
  );
  findTokenNodeByCreator = this.syntax.findTokenNodeByCreator.bind(this.syntax);
  findSpaceNodeByCreator = this.syntax.findSpaceNodeByCreator.bind(this.syntax);
  getIgnoredNodes = this.syntax.getIgnoredNodes.bind(this.syntax);
  pushIgnoredNodes = this.syntax.pushIgnoredNodes.bind(this.syntax);
}
