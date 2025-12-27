export type ParamChannel = string & { type?: "ParamChannel" }; // setting, config

/**
 * If the param is set by the param declaration, then instance-declaration
 * If it's set by the component defaults, then component-default
 */
export type ParamProducer = "instance-declaration" | "component-default";

export type Audience = (string | number) & { type?: "ParamAudience" };

export type Operator = "assign" | "append" | "prepend" | "shift" | "unshift";

export interface IAstParamSemanticCapability {
  setAudience(channel: Audience): this;
  getAudience(): Audience;
  setOperator(operator: Operator): this;
  getOperator(): Operator;

  // setProducer(producer: ParamProducer): this;
  // getProducer(): ParamProducer;
  setChannel(channel: ParamChannel): this;
  getChannel(): ParamChannel;
}
