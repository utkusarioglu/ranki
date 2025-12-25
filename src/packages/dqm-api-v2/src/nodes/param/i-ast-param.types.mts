import type {
  Alias,
  Chain,
  ChannelParamSpecs,
  CommonTransportsConstructorParams,
  IId,
  ParamChannel,
  ParamDefaultValue,
} from "../../export.types.mjs";
import type {
  AstSourceView,
  Audience,
  IAstNode,
  Operator,
  ParamProducer,
} from "../export.types.mjs";

export type IParam = IAstNode & IParamOther & IParamIdCapability;

export interface IParamOther {
  setAudience(channel: Audience): this;
  setOperator(operator: Operator): this;
  setProducer(producer: ParamProducer): this;
  setValues(values: AstSourceView[]): this;
  setSpecs(config: ChannelParamSpecs): this;
  setChannel(channel: ParamChannel): this;

  setDefaultValues(valueSpec: ParamDefaultValue[]): this;
  getDefaultValues(): ParamDefaultValue[];

  setId(id: Alias | Chain): IParam;

  getAudience(): Audience;
  getOperator(): Operator;
  getValues(): AstSourceView[];
  // getId(): IId;
  getSpecs(): ChannelParamSpecs;
  getChannel(): ParamChannel;
  getProducer(): ParamProducer;

  getRawParam(): IParam | null;
  setRawParam(p: IParam): this;
}

export type IParamIdCapability = Pick<
  IId,
  | "getId"
  | "getIdString"
  | "getAlias"
  | "getAliasString"
  | "getChain"
  | "getChainString"
  | "setAlias"
  | "setPosition"
>;

export type IParamConstructor = new (
  c: CommonTransportsConstructorParams,
) => IParam;
