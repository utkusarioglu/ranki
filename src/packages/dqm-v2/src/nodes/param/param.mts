import type {
  // Alias,
  // Chain,
  // Audience,
  IAstParamNode,
  // Operator,
  // ParamChannel,
  // ParamProducer,
  // ParamDefaultValue,
  // ChannelParamSpecs,
  // IdString,
  // AliasString,
  // ChainString,
  // AstSourceView,
} from "@dqm/package-dqm-api-v2";
// import { Id } from "../../id/id.mjs";
// import { rejectValues } from "@dqm/package-dqm-utils";
import { AstNode } from "../ast/ast-node.mjs";
// import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { rawParamCapability } from "./capabilities/raw-param.cap.mjs";
import { paramSemanticCapability } from "./capabilities/param-semantic.cap.mjs";
import { paramValueCapability } from "./capabilities/param-value.cap.mjs";
import { idCapability } from "./capabilities/id.cap.mjs";
import { paramSpecsCapability } from "./capabilities/specs.cap.mjs";

export class AstParamNode extends AstNode implements IAstParamNode {
  // private audience: Audience = ALL_AUDIENCES;
  // private operator!: Operator;
  // private values: AstSourceView[] = [];
  // private defaultValues: ParamDefaultValue[] = [];
  // private id = new Id();
  // private specs!: ChannelParamSpecs;
  // private channel!: ParamChannel;
  // private producer: ParamProducer = "instance-declaration";

  private rawParam = rawParamCapability(this);
  private paramSemantic = paramSemanticCapability(this);
  private value = paramValueCapability(this);
  private id = idCapability(this);
  private specs = paramSpecsCapability(this);

  // RAW PARAM
  setRawParam = this.rawParam.setRawParam.bind(this.rawParam);
  getRawParam = this.rawParam.getRawParam.bind(this.rawParam);

  // SPECS
  getSpecs = this.specs.getSpecs;
  setSpecs = this.specs.setSpecs;

  // setSpecs(specs: ChannelParamSpecs): this {
  //   this.specs = specs;
  //   return this;
  // }

  // @rejectValues(undefined)
  // getSpecs(): ChannelParamSpecs {
  //   return this.specs;
  // }

  // PARAM SEMANTIC
  setAudience = this.paramSemantic.setAudience.bind(this.paramSemantic);
  getAudience = this.paramSemantic.getAudience.bind(this.paramSemantic);
  setOperator = this.paramSemantic.setOperator.bind(this.paramSemantic);
  getOperator = this.paramSemantic.getOperator.bind(this.paramSemantic);
  setProducer = this.paramSemantic.setProducer.bind(this.paramSemantic);
  getProducer = this.paramSemantic.getProducer.bind(this.paramSemantic);
  setChannel = this.paramSemantic.setChannel.bind(this.paramSemantic);
  getChannel = this.paramSemantic.getChannel.bind(this.paramSemantic);

  // /**
  //  * Tokens like `$.key`.
  //  */
  // @dependsOn("specs")
  // setAudience(audience: Audience): never | this {
  //   this.audience = audience;
  //   return this;
  // }

  // @rejectValues(undefined)
  // getAudience(): Audience {
  //   return this.audience;
  // }

  // /**
  //  * = += -= =+ =- etc
  //  */
  // setOperator(operator: Operator): this {
  //   this.operator = operator;
  //   return this;
  // }

  // @rejectValues(undefined)
  // getOperator(): Operator {
  //   return this.operator;
  // }

  // setChannel(channel: ParamChannel): this {
  //   this.channel = channel;
  //   return this;
  // }

  // getChannel(): ParamChannel {
  //   return this.channel;
  // }

  // setProducer(producer: ParamProducer): this {
  //   this.producer = producer;
  //   return this;
  // }

  // getProducer(): ParamProducer {
  //   return this.producer;
  // }

  // @dependsOn("specs")
  // setId(id: Alias | Chain): this {
  //   this.id.setId(id);
  //   return this;
  // }

  setAlias = this.id.setAlias;
  getAlias = this.id.getAlias;
  getAliasString = this.id.getAliasString;
  setPosition = this.id.setPosition;
  getId = this.id.getId;
  setId = this.id.setId;
  getIdString = this.id.getIdString;
  getChain = this.id.getChain;
  getChainString = this.id.getChainString;

  // getId(): Alias | Chain {
  //   return this.id.getId();
  // }

  // getIdString(): IdString {
  //   return this.id.getIdString();
  // }

  // getAlias(): Alias | undefined {
  //   return this.id.getAlias();
  // }

  // getAliasString(): AliasString {
  //   return this.id.getAliasString();
  // }

  // getChain(): Chain {
  //   return this.id.getChain();
  // }

  // getChainString(): ChainString {
  //   return this.id.getChainString();
  // }

  // VALUE
  setDefaultValues = this.value.setDefaultValues.bind(this.value);
  getDefaultValues = this.value.getDefaultValues.bind(this.value);
  setValues = this.value.setValues.bind(this.value);
  getValues = this.value.getValues.bind(this.value);
  checkValues = this.value.checkValues.bind(this.value);

  // // @dependsOn("specs", "defaultValues")
  // setValues(values: AstSourceView[]): this {
  //   this.values = values;
  //   return this;
  // }

  // getValues(): AstSourceView[] {
  //   return this.values;
  // }

  // // TODO
  // @dependsOn("specs", "defaultValues")
  // checkValues() {
  //   if (this.values.length > this.defaultValues.length) {
  //     throw new DqmAppError({
  //       code: "TOO_MANY_VALUES",
  //       why: "Params are tuples and cannot define larger arrays than their default values",
  //       cause: null,
  //       details: {
  //         values: this.values,
  //         defaults: this.defaultValues,
  //         obj: this,
  //       },
  //     });
  //   }
  // }

  // @dependsOn("specs")
  // setDefaultValues(valueSpec: ParamDefaultValue[]): this {
  //   this.defaultValues = valueSpec;
  //   return this;
  // }

  // getDefaultValues(): ParamDefaultValue[] {
  //   return this.defaultValues;
  // }
}
