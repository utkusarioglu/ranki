import type {
  Alias,
  Chain,
  CommonTransportsConstructorParams,
  IId,
} from "../../../export.types.mjs";
import type { IAstNode } from "../export.types.mjs";
import type {
  IAstParamValueCapability,
  IAstParamSemanticCapability,
} from "../../capabilities/export.types.mjs";

export interface IAstParamNode
  extends IAstNode,
    IAstParamIdCapability,
    IAstParamSemanticCapability,
    IAstParamValueCapability {}

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
