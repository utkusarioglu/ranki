import type { IConfig, ICpx, IPlugins } from "../../export.types.mjs";
import type * as ohm from "ohm-js";

export type ContentDirection = "block" | "inline";
export type IAstNodeNature = "literal" | "synthetic";
export type ActionMethod = string & { type?: "OhmActionMethod" };
export type IAstNodeKind = "parent" | "child";

type CpxFuncParam = (cpx: ICpx) => ICpx;

export type IAstNodeContext = {
  // cpx: ICpx;
  // cps: ICps;
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

export interface IAstNode {
  setKind(kind: IAstNodeKind): IAstNode;
  getKind(): IAstNodeKind;
  hookPlugins(plugins: IPlugins): IAstNode;
  hookConfig(config: IConfig): IAstNode;
  newAst(): IAstNode;
  setParent(parent: IAstNode): IAstNode;
  setCpx(cpx: ICpx): IAstNode;
  getCpx(): ICpx;
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
  setChildrenNodes(
    method: ActionMethod,
    required: ohm.Node[],
    alt: ohm.Node[],
  ): IAstNode;
  /**
   *  these children methods could be combined into one with some clever param shape
   */
  // setChildrenListOf(method: ActionMethod, alt: ohm.Node[]): IAstNode;
  pushSpaceNode(
    left: string,
    right: string,
    method: ActionMethod,
    node: ohm.Node,
  ): IAstNode;
  pushTokenNode(
    left: string,
    right: string,
    method: ActionMethod,
    node: ohm.Node,
  ): IAstNode;
  pushSubtreeNode(name: string, method: ActionMethod, ast: ohm.Node): IAstNode;
}
