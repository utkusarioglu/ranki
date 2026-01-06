import type {
  IAstNode,
  PushedNodeDefinition,
  IAstParamNode,
  AstSourceView,
  CpxFuncParam,
  IParser,
} from "@dqm/package-dqm-api-v2";
import type * as ohm from "ohm-js";
import { assertNotUndefined } from "@dqm/package-dqm-utils";
import { CommonTransports } from "../../common-transports.mjs";
import { edgeCapability } from "../../capabilities/edge.capability.mjs";
import { syntaxCapability } from "./capabilities/syntax.capability.mjs";
import { semanticCapability } from "./capabilities/semantic.capability.mjs";
import { ohmCapability } from "./capabilities/ohm.capability.mjs";
import { viewCapability } from "./capabilities/view.capability.mjs";
import { counterCapability } from "./capabilities/counter.capability.mjs";
import { cpxCollection } from "../../cp/capabilities/cpx-collection.cap.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { transformClassCapability } from "./capabilities/transform.capability.mjs";

const DEFAULT_CLIMB = 1;

export class AstNode extends CommonTransports implements IAstNode {
  private readonly cpx = cpxCollection(this);
  private readonly semantic = semanticCapability(this);
  private readonly astE = edgeCapability<IAstNode>(this, "Ast");
  private readonly syntax = syntaxCapability(this);
  private readonly ohm = ohmCapability(this);
  private readonly view = viewCapability(this);
  private readonly counter = counterCapability(this);
  // @ts-ignore
  private readonly tc = transformClassCapability<
    IAstNode,
    // @ts-ignore
    TransformClassDict
  >(this);
  private parser: IParser | null = null;

  parse(source: string): this {
    const cpx = this.getCpx();
    assertExists(cpx, { why: "Cpx has to be defined for parsing to occur" });
    // TODO theater is wrong
    const parsed = cpx.parse({ dqm: source, theater: "default" });
    // parsed.setAstParent(this);
    this.syntax.pushParsedChild(parsed);
    return this;
  }

  setCpsClimb(climb: number | null): this {
    let current = this.getCpx().getLeafCps();
    climb = climb === null ? DEFAULT_CLIMB : climb;
    let c = 0;
    while (c < climb) {
      c++;
      const parent = current.getCpsParent();
      assertExists(parent, { why: "Requested pause climb demands a parent" });
      current = parent;
    }
    const cpx = current.getCpx();
    assertExists(cpx, {
      why: "Requested climb Cps needs to have an assigned Cpx",
    });
    cpx.setTargetCps(current);
    this.setCpx(cpx);
    return this;
  }

  // TODO this needs a lot of work
  newCpx(cpxCallback: CpxFuncParam): this {
    const Cpx = this.getPlugins().getCpxConstructor();
    let parentCpx = null;
    let prevCpx = null;
    try {
      parentCpx = this.getCpx();
      prevCpx = parentCpx?.getCpxEdges().at(-1);
    } catch (e) {}
    const newCpxMold = new Cpx(this.getTransports()).setRootAst(this);
    // !FIX this setting the parent like this is faulty it clashes with paused container climbing up
    newCpxMold.setCpxParent(parentCpx);
    if (prevCpx) {
      newCpxMold.setCpxPrev(prevCpx);
    }
    this.cpx.setCpx(cpxCallback(newCpxMold));
    return this;
  }

  newAst(ohm: ohm.Node): IAstNode {
    return this.newChild<IAstNode>(
      this.getPlugins().getAstNodeConstructor(),
      ohm,
    );
  }

  newParam(ohm: ohm.Node): IAstParamNode {
    return this.newChild<IAstParamNode>(
      this.getPlugins().getParamConstructor(),
      ohm,
    );
  }

  private postCreationActions() {
    if (this.getAstEdges().length) {
      return;
    }
    this.counter.incrementDirection(this.getDirection());
  }

  /**
   * @dev
   * #1 When `newChild` is called, it is assumed that the parent's creation is
   * already complete. This allows us to do calculations such as determining
   * `direction`
   */
  private newChild<T>(ChildConstructor: any, ohm: ohm.Node) {
    //#1
    const childrenCount = this.getAstEdges().length;
    if (!childrenCount) {
      this.postCreationActions();
    }

    const child: AstNode = new ChildConstructor(this.getTransports());
    child
      .setAstParent(this)
      .setOhmNode(ohm)
      .setCpx(this.getCpx())
      .setChildIndex(childrenCount)
      .setInheritedCounters(this.counter.getInheritedCounters())
      .setDirection(this.getDirection());
    return child as T;
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
  getStartIndex = this.ohm.getStartIndex.bind(this.ohm);
  getEndIndex = this.ohm.getEndIndex.bind(this.ohm);

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
  setAstParent = this.astE.setParent.bind(this.astE);
  getAstParent = this.astE.getParent.bind(this.astE);
  getAstNext = this.astE.getNext.bind(this.astE);
  getAstPrev = this.astE.getPrev.bind(this.astE);
  setAstPrev = this.astE.setPrev.bind(this.astE);
  setAstNext = this.astE.setNext.bind(this.astE);
  getAstEdges = this.astE.getEdges.bind(this.astE);
  pushAstEdge = this.astE.pushEdge.bind(this.astE);

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
    assertNotUndefined(this.view.getDefinedLeafDecoder(), {
      why: "Leaf nodes cannot have children nodes",
      details: {
        nodeSetRaw,
      },
    });
    this.semantic.setKind("parent");
    const cpxUnique = this.getCpx().getUnique();
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

  // CPX
  getCpx = this.cpx.getCpx.bind(this.cpx);
  setCpx = this.cpx.setCpx.bind(this.cpx);

  // PARSER REFERENCE
  setParser(parser: IParser): this {
    this.parser = parser;
    return this;
  }

  getParser(): IParser | null {
    return this.parser;
  }

  // TRANSFORM CLASS
  // collectTransformClasses(): TransformClassDict<IAstNode> {
  //   const subtree = this.getSubtreeNodes();
  //   return this.tc.getTransformClassDict(subtree);
  // }
  // @ts-ignore
  setTransformClass = this.tc.setTransformClass.bind(this.tc);
  // @ts-ignore
  getTransformClass = this.tc.getTransformClass.bind(this.tc);
}
