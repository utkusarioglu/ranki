import type * as ohm from "ohm-js";
import type { ICpx } from "../../cp/i-cpx.types.mjs";
import type { CommonTransportsConstructorParams } from "../../common-transports.types.mjs";
import type { IAstNode } from "../../export.types.mjs";

export type PushedNodeDefinition = [IAstNodeRelationship, ohm.Node];

export type IAstNodeActionDict = ohm.ActionDict<IAstNode[] | IAstNode>;

export type ContentDirection = "block" | "inline";

export type IAstNodeNature = "literal" | "synthetic";

export type ActionMethod = string & { type?: "OhmActionMethod" };

export type IAstNodeKind = "parent" | "leaf";

export type CpxFuncParam = (cpx: ICpx) => ICpx;

export type IAstNodeContext = {
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

export type IAstNodeRelationship = "space" | "token" | "node";

export type IAstNodeConstructor = new (
  c: CommonTransportsConstructorParams,
) => IAstNode;

export type NodeName = string & { type?: "NodeName" };
export type CreatorName = string & { type?: "OhmJsCreatorName" };

export type SubtreeNodes = IAstNode[] & { type?: "SubtreeNodes" };
export type SpaceNodes = IAstNode[] & { type?: "SpaceNodes" };
export type TokenNodes = IAstNode[] & { type?: "TokenNodes" };
export type ChildrenNodes = IAstNode[] & { type?: "ChildrenNodes" };

export type AstSourceString = string & { type?: "AstSourceString" };
export type CreationMethod = string & { type?: "CreationMethod" };

/**
 * @dev
 * #1 This property's type can be anything depending on what decoder is defined
 * for the node.
 */
export interface AstSourceViewCommon {
  type: string;
  raw: string;
}

export type AstSourceView<Custom = any> = AstSourceViewCommon &
  AstSourceViewAdditional<Custom>;

export type AstSourceViewAdditional<Value = any> = {
  subType?: string;
  value: Value;
};

export type AstSourceViewDecoderCustom<Value> = (
  input: string,
) => AstSourceViewAdditional<Value>;
