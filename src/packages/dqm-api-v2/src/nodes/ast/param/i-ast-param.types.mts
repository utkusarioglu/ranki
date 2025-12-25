import type {
  Alias,
  Chain,
  CommonTransportsConstructorParams,
  IAstParamSpecsCapability,
  IId,
} from "../../../export.types.mjs";
import type { IAstNode } from "../export.types.mjs";
import type {
  IAstParamSemanticCapability,
  IAstParamValueCapability,
} from "../capabilities/export.types.mjs";

export interface IAstParamNode
  extends IAstNode,
    IAstParamSpecsCapability,
    IAstParamIdCapability,
    IAstParamSemanticCapability,
    IAstParamValueCapability,
    IAstParamRawCapability {}

export interface IAstParamRawCapability {
  getRawParam(): IAstParamNode | null;
  setRawParam(p: IAstParamNode): this;
}

export interface IAstParamIdCapability
  extends Pick<
    IId,
    | "getId"
    | "getIdString"
    | "getAlias"
    | "getAliasString"
    | "getChain"
    | "getChainString"
    | "setAlias"
    | "setPosition"
  > {
  setId(id: Alias | Chain): this;
}

export type IParamConstructor = new (
  c: CommonTransportsConstructorParams,
) => IAstParamNode;
