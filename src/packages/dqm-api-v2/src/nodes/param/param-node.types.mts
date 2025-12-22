import type {
  Alias,
  Chain,
  ChannelParamSpecs,
  IId,
  ParamDefaultValue,
} from "../../plugins/component/export.types.mjs";
import type { AstSourceView, IAstNode } from "../ast/ast-node.types.mjs";
import type { CommonTransportsConstructorParams } from "../common-transports.types.mjs";

export type ParamChannel = string & { type?: "ParamChannel" }; // setting, config

/**
 * If the param is set by the param declaration, then instance-declaration
 * If it's set by the component defaults, then component-default
 */
export type ParamProducer = "instance-declaration" | "component-default";

export type Audience = (string | number) & { type?: "ParamAudience" };

export type Operator = "assign" | "append" | "prepend" | "shift" | "unshift";

export type ParamValuePrimitive = string | number;

export interface IParam extends IAstNode {
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
  getId(): IId;
  getSpecs(): ChannelParamSpecs;
  getChannel(): ParamChannel;
  getProducer(): ParamProducer;

  getRawParam(): IParam | null;
  setRawParam(p: IParam): this;
}

export type IParamConstructor = new (
  c: CommonTransportsConstructorParams,
) => IParam;
