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
import type {
  CpsDefinition,
  IDqmComponentTransformFunction,
} from "../../plugins/component/component.types.mjs";
import type {
  Alias,
  Chain,
  IId,
} from "../../plugins/component/id/id.types.mjs";
import type { DqmConfig, ICommonTransports } from "../../export.types.mjs";

export interface ICps
  extends ICommonTransports,
    ICpsIdCapability,
    ICpsUniqueCapability,
    IVerticesCapability<ICps>,
    CpxCollectionCapability,
    CpsValidationCapability,
    CpsTransformCapability {}

export interface CpsValidationCapability {
  validate(): void;
}

export interface CpsTransformCapability {
  getTransformer(): IDqmComponentTransformFunction;
}

export interface ICpsUniqueCapability {
  setDefinition(def: CpsDefinition): this;
  getParams(): ICpsParam[];
  parse(input: CpxParseInput): IAstNode;
  isOnFailMode(): boolean;
  getChannels(): ParamChannel[];
  getDqmConfig(): DqmConfig;
  getComponentConfig<T>(): T;

  getIntendedId(): Chain | Alias;
  getSettledId(): Chain | Alias | null;
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
