import type { CpxParseInput } from "../../dqm.types.mjs";
import type {
  CpxCollectionCapability,
  IAstNode,
  // IAstParamNode,
  ICpsParam,
  IVerticesCapability,
  ParamChannel,
} from "../export.types.mjs";
import type { ICpx } from "./i-cpx.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";
import type { CpsDefinition } from "../../plugins/component/component.types.mjs";
import type { IId } from "../../plugins/component/id/id.types.mjs";
import type { DqmConfig } from "../../export.types.mjs";

export interface ICps
  extends ICpsIdCapability,
    ICpsUniqueCapability,
    IVerticesCapability<ICps>,
    CpxCollectionCapability {}

export interface ICpsUniqueCapability {
  setDefinition(def: CpsDefinition): this;
  getParams(): ICpsParam[];
  parse(input: CpxParseInput): IAstNode;
  getOnFailMode(): boolean;
  getChannelCompilation(channel: ParamChannel): any;
  getChannels(): ParamChannel[];
  getDqmConfig(): DqmConfig;
}

export type ICpsIdCapability = Pick<
  IId,
  | "getId"
  | "getIdString"
  | "getAlias"
  | "getAliasString"
  | "getChain"
  | "getChainString"
>;

export type ICpsConstructor = new (
  transports: CommonTransportsConstructorParams,
) => ICpx;
