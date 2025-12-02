import type { IAstNode } from "../../../export.types.mjs";
import type {
  ChannelParamSpecs,
  ParamDefaultValue,
} from "../component.types.mjs";
import type { IId } from "../id/id.types.mjs";

export type ParamType = "string" | "number" | "boolean" | "chain";

export type ParamChannel = string & { type?: "ParamChannel" }; // setting, config

/**
 * If the param is set by the param declaration, then instance-declaration
 * If it's set by the component defaults, then component-default
 */
export type ParamProducer = "instance-declaration" | "component-default";

export type Audience = (string | number) & { type?: "ParamAudience" };

export type Operator = "assign" | "append" | "prepend" | "shift" | "unshift";

export type ParamValue = string | number | boolean;

export interface ParamValueSpec {
  type: ParamType;
  value: ParamValue;
}

export type ParamValuePrimitive = string | number;

export interface IParam extends IAstNode {
  setAudience(channel: Audience): this;
  setOperator(operator: Operator): this;
  setProducer(producer: ParamProducer): this;
  setValues(values: ParamValueSpec[]): this;
  setSpecs(config: ChannelParamSpecs): this;
  setChannel(channel: ParamChannel): this;
  setDefaultValues(valueSpec: ParamDefaultValue[]): this;

  getAudience(): Audience;
  getOperator(): Operator;
  getValues(): ParamValueSpec[];
  getId(): IId;
  getSpecs(): ChannelParamSpecs;
  getChannel(): ParamChannel;
  getProducer(): ParamProducer;
}
