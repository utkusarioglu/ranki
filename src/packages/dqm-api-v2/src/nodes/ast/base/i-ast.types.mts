import type * as ohm from "ohm-js";
import type { IAstParamNode } from "../param/export.types.mjs";
import type { CpxFuncParam } from "./i-ast-node.types.mjs";
import type {
  IEdgeCapability,
  IAstNodeViewCapabilities,
  IAstNodeSyntaxCapabilities,
  IAstNodeSemanticCapabilities,
  IAstNodeOhmCapabilities,
  IAstNodeCounterCapabilities,
  CpxCollectionCapability,
} from "../capabilities/export.types.mjs";
import type { ICommonTransports } from "../../common-transports.types.mjs";
import type { IParser } from "../../../export.types.mjs";
import type { IAstNodeTransformCapability } from "../capabilities/transform.cap.types.mjs";

type IAstNodeEdges = IEdgeCapability<
  IAstNode,
  IAstNode,
  "Ast",
  "getAstEdges" | "setAstParent" | "getAstParent" | "setAstPrev" | "getAstPrev"
  // | "pushAstEdge"
>;
// | "setParent"
// | "getParent"
// | "getPrev"
// | "setPrev"
// | "setNext"
// | "getNext"
// | "getChildren"

export interface IAstNode
  extends ICommonTransports,
    IAstNodeCounterCapabilities,
    IAstNodeOhmCapabilities,
    IAstNodeSemanticCapabilities,
    IAstNodeSyntaxCapabilities<IAstNode>,
    IAstNodeEdges,
    // Omit<IVerticesCapability<IAstNode>, "pushChild">,
    // Vertices,
    IAstNodeViewCapabilities,
    IAstNodeUniqueCapability,
    CpxCollectionCapability,
    IAstNodeParserReferenceCapability,
    IAstNodeTransformCapability {}

export interface IAstNodeParserReferenceCapability {
  setParser(parser: IParser): this;
  getParser(): IParser | null;
}

// type Vertices = Pick<
//   IVerticesCapability<IAstNode>,
//   | "setParent"
//   | "getParent"
//   | "getPrev"
//   | "setPrev"
//   | "setNext"
//   | "getNext"
//   | "getChildren"
// >;

export interface IAstNodeUniqueCapability {
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
  setCpsClimb(climb: number | null): this;
  parse(source: string): this;
}
