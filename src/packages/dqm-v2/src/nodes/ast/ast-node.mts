import type {
  IAstNode,
  ICpx,
  PushedNodeDefinition,
  IParam,
  AstSourceView,
  AstSourceViewBase,
} from "@dqm/package-dqm-api-v2";
import type * as ohm from "ohm-js";
import { assertNotExists, rejectValues } from "@dqm/package-utils";
import { CommonTransports } from "../common-transports.mjs";
import { verticesCapability } from "./capabilities/verticesCapability.mjs";
import { nodesCapability } from "./capabilities/nodesCapability.mjs";
import { semanticCapability } from "./capabilities/semanticCapability.mjs";
import { ohmCapability } from "./capabilities/ohmCapability.mjs";
import { viewCapability } from "./capabilities/viewCapability.mjs";

export class AstNode extends CommonTransports implements IAstNode {
  private semantic = semanticCapability(this);
  private vertices = verticesCapability(this);
  private nodes = nodesCapability(this);
  private ohm = ohmCapability(this);
  private view = viewCapability(this);
  private cpx!: ICpx;

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
    return this.newChild(this.getPlugins().getAstNodeConstructor(), ohm);
  }

  newParam(ohm: ohm.Node): IParam {
    return this.newChild(this.getPlugins().getParamConstructor(), ohm);
  }

  private newChild(ChildConstructor: any, ohm: ohm.Node) {
    const child = new ChildConstructor(this.getTransports());
    child
      .setParent(this)
      .setOhmNode(ohm)
      .setCpx(this.getCpx())
      .setDirection(this.getDirection());
    this.vertices.pushChild(child);
    return child;
  }

  @rejectValues(undefined)
  getCpx(): ICpx {
    return this.cpx;
  }

  setCpx(cpx: ICpx): this {
    this.cpx = cpx;
    return this;
  }

  // VIEW
  setLeafViewDecoder = this.view.setLeafViewDecoder.bind(this.view);
  getLeafView<T extends AstSourceViewBase>(): AstSourceView<T> {
    const raw = this.getSourceString();
    return this.view.getLeafView(raw);
  }

  // OHM
  setOhmNode = this.ohm.setOhmNode.bind(this.ohm);
  getSourceString = this.ohm.getSourceString.bind(this.ohm);
  getCreator = this.ohm.getCreator.bind(this.ohm);

  // SEMANTIC
  getKind = this.semantic.getKind.bind(this.semantic);
  setDirection = this.semantic.setDirection.bind(this.semantic);
  setNature = this.semantic.setNature.bind(this.semantic);
  setMeaning = this.semantic.setMeaning.bind(this.semantic);
  getDirection = this.semantic.getDirection.bind(this.semantic);
  getMeaning = this.semantic.getMeaning.bind(this.semantic);
  getCreationMethod = this.semantic.getCreationMethod.bind(this.semantic);
  setCreationMethod = this.semantic.setCreationMethod.bind(this.semantic);
  setRelationship = this.semantic.setRelationship.bind(this.semantic);
  getRelationship = this.semantic.getRelationship.bind(this.semantic);

  // VERTICES
  setParent = this.vertices.setParent.bind(this.vertices);
  getNext = this.vertices.getNext.bind(this.vertices);
  getPrev = this.vertices.getPrev.bind(this.vertices);
  setPrev = this.vertices.setPrev.bind(this.vertices);
  setNext = this.vertices.setNext.bind(this.vertices);

  // NODES
  getChildrenNodes = this.nodes.getChildrenNodes.bind(this.nodes);
  getTokenNodes = this.nodes.getTokenNodes.bind(this.nodes);
  getSpaceNodes = this.nodes.getSpaceNodes.bind(this.nodes);
  getSubtreeNodes = this.nodes.getSubtreeNodes.bind(this.nodes);
  findSubtreeNodeByCreator = this.nodes.findSubtreeNodeByCreator.bind(
    this.nodes,
  );
  findTokenNodeByCreator = this.nodes.findTokenNodeByCreator.bind(this.nodes);
  findSpaceNodeByCreator = this.nodes.findSpaceNodeByCreator.bind(this.nodes);
  getIgnoredNodes = this.nodes.getIgnoredNodes.bind(this.nodes);
  pushIgnoredNodes = this.nodes.pushIgnoredNodes.bind(this.nodes);

  /**
   * @dev
   * #1 The check for leafDecoder relates to only leaves being able to define a
   * decoder. If a decoder is defined, the node shouldn't be able to become a
   * parent. Which means, pushing nodes to the node shouldn't be possible.
   *
   * #2 This is experimental. The aim is to see if the `subtree` and `child`
   * distinction can be made through the unique id of CPS
   * */
  // @dependsOn("kind")
  pushNodes(...nodeSetRaw: PushedNodeDefinition[]): this {
    // #1
    assertNotExists(this.view.getDefinedLeafDecoder(), {
      why: "Leaf nodes cannot have children nodes",
      nodeSetRaw,
    });
    this.semantic.setKind("parent");
    const cpxUnique = this.getCpx().getId().getUnique();
    this.nodes.pushNodes(nodeSetRaw, cpxUnique);
    return this;
  }
}
