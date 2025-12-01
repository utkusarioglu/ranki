import type { ICpx } from "../../export.types.mjs";
import type * as ohm from "ohm-js";

export type ContentDirection = "block" | "inline";
export type IAstNodeNature = "literal" | "synthetic";
export type ActionMethod = string & { type?: "OhmActionMethod" };

type CpxFuncParam = (cpx: ICpx) => ICpx;

export interface IAstNode {
  newAst(): IAstNode;
  /**
   * This is supposed to create a new cpx and then let the node build it
   * inside the callback:
   *
   * .newCpx(cpx => cpx
   *    .setDefinition(...)
   *    .setStartRule(...)
   *  )
   */
  newCpx(f: CpxFuncParam): IAstNode;
  /**
   * If `newCpx` works, these three won't be needed
   */
  // setCpx(cpx: ICpx): IAstNode;
  // setCps(cps: ICps): IAstNode;
  // setParent(parent: IAstNode): IAstNode;

  setDirection(direction: ContentDirection): IAstNode;

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
  setChildrenNonEmptyListOf(
    method: ActionMethod,
    required: ohm.Node[],
    alt: ohm.Node[],
  ): IAstNode;
  /**
   *  these children methods could be combined into one with some clever param shape
   */
  setChildrenListOf(method: ActionMethod, alt: ohm.Node[]): IAstNode;
  pushSpace(method: ActionMethod, node: ohm.Node): IAstNode;
  pushToken(
    left: string,
    right: string,
    method: ActionMethod,
    node: ohm.Node,
  ): IAstNode;
  pushSubtreeNode(name: string, method: ActionMethod, ast: ohm.Node): IAstNode;
}
