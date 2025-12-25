import type * as ohm from "ohm-js";
import type { ICpx } from "../../cp/i-cpx.types.mjs";
import type { IAstParamNode } from "../param/export.types.mjs";
import type { CpxFuncParam } from "./i-ast-node.types.mjs";
import type {
  IAstNodeVerticesCapabilities,
  IAstNodeViewCapabilities,
  IAstNodeSyntaxCapabilities,
  IAstNodeSemanticCapabilities,
  IAstNodeOhmCapabilities,
  IAstNodeCounterCapabilities,
} from "../capabilities/export.types.mjs";

export interface IAstNode
  extends IAstNodeCounterCapabilities,
    IAstNodeOhmCapabilities,
    IAstNodeSemanticCapabilities,
    IAstNodeSyntaxCapabilities<IAstNode>,
    IAstNodeVerticesCapabilities<IAstNode>,
    IAstNodeViewCapabilities,
    IAstNodeUniqueCapability {}

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
  getCpx(): ICpx | null;
}
