import type { Alias, Chain, ChainString, IId } from "../../export.types.mjs";
import type { IAstParamCapability } from "../capabilities/raw-param.cap.types.mjs";
import type { AstSourceView } from "../export.types.mjs";

export interface ICpsParam
  extends ICpsParamIdCapability,
    CpsParamValuesCapability,
    IAstParamCapability<ICpsParam> {}

export interface MutationEntry {
  type: "mutator" | "eraser";
  chainString: ChainString;
  value: any;
}

export interface CpsParamValuesCapability {
  getAstValues(): AstSourceView[] | never;
  getMutationEntries(includeChannel: boolean): MutationEntry[];
}

export interface ICpsParamIdCapability
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
