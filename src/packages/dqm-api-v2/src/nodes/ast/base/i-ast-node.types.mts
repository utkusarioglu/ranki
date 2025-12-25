import type * as ohm from "ohm-js";
import type { ICpx } from "../../cp/i-cpx.types.mjs";
import type { CommonTransportsConstructorParams } from "../../common-transports.types.mjs";
import type { IAstNode } from "../../export.types.mjs";

export type IAstNodeActionDict = ohm.ActionDict<IAstNode[] | IAstNode>;

export type ActionMethod = string & { type?: "OhmActionMethod" };

export type CpxFuncParam = (cpx: ICpx) => ICpx;

export type IAstNodeContext = {
  ast: IAstNode;
};

// export interface IAstSpaceNode {
//   type: "block" | "clearance" | "nl" | "whitespace";
//   raw: string;
// }

// export interface IAstTokenNode {
//   type: string;
//   raw: string;
// }

export type IAstNodeConstructor = new (
  c: CommonTransportsConstructorParams,
) => IAstNode;

export type NodeName = string & { type?: "NodeName" };
