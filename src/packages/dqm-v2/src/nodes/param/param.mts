import type {
  Alias,
  Chain,
  Audience,
  IAstParamNode,
  Operator,
  ParamChannel,
  ParamProducer,
  ParamDefaultValue,
  ChannelParamSpecs,
  AstSourceView,
  IdString,
  AliasString,
  ChainString,
} from "@dqm/package-dqm-api-v2";
import { Id } from "../../id/id.mjs";
import { ALL_AUDIENCES } from "./param.constants.mjs";
import { rejectValues, dependsOn } from "@dqm/package-dqm-utils";
import { AstNode } from "../ast/ast-node.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

export class AstParamNode extends AstNode implements IAstParamNode {
  private audience: Audience = ALL_AUDIENCES;
  private operator!: Operator;
  private values: AstSourceView[] = [];
  private defaultValues: ParamDefaultValue[] = [];
  private id = new Id();
  private specs!: ChannelParamSpecs;
  private channel!: ParamChannel;
  private producer: ParamProducer = "instance-declaration";
  private rawParam: IAstParamNode | null = null;

  setRawParam(rawParam: IAstParamNode): this {
    this.rawParam = rawParam;
    return this;
  }

  getRawParam(): IAstParamNode | null {
    return this.rawParam;
  }

  setSpecs(specs: ChannelParamSpecs): this {
    this.specs = specs;
    return this;
  }

  @rejectValues(undefined)
  getSpecs(): ChannelParamSpecs {
    return this.specs;
  }

  /**
   * Tokens like `$.key`.
   */
  @dependsOn("specs")
  setAudience(audience: Audience): never | this {
    this.audience = audience;
    return this;
  }

  @rejectValues(undefined)
  getAudience(): Audience {
    return this.audience;
  }

  /**
   * = += -= =+ =- etc
   */
  setOperator(operator: Operator): this {
    this.operator = operator;
    return this;
  }

  @rejectValues(undefined)
  getOperator(): Operator {
    return this.operator;
  }

  // @dependsOn("specs")
  setId(id: Alias | Chain): IAstParamNode {
    this.id.setId(id);
    return this;
  }

  setAlias = this.id.setAlias.bind(this.id);
  setPosition = this.id.setPosition.bind(this.id);

  // getId(): IId {
  //   return this.id;
  // }
  getId(): Alias | Chain {
    return this.id.getId();
  }

  getIdString(): IdString {
    return this.id.getIdString();
  }

  getAlias(): Alias | undefined {
    return this.id.getAlias();
  }

  getAliasString(): AliasString {
    return this.id.getAliasString();
  }

  getChain(): Chain {
    return this.id.getChain();
  }

  getChainString(): ChainString {
    return this.id.getChainString();
  }

  // @dependsOn("specs", "defaultValues")
  setValues(values: AstSourceView[]): this {
    this.values = values;
    return this;
  }

  // TODO
  @dependsOn("specs", "defaultValues")
  checkValues() {
    if (this.values.length > this.defaultValues.length) {
      throw new DqmAppError({
        code: "TOO_MANY_VALUES",
        why: "Params are tuples and cannot define larger arrays than their default values",
        cause: null,
        details: {
          values: this.values,
          defaults: this.defaultValues,
          obj: this,
        },
      });
    }
  }

  @dependsOn("specs")
  setDefaultValues(valueSpec: ParamDefaultValue[]): this {
    this.defaultValues = valueSpec;
    return this;
  }

  getDefaultValues(): ParamDefaultValue[] {
    return this.defaultValues;
  }

  getValues(): AstSourceView[] {
    return this.values;
  }

  setChannel(channel: ParamChannel): this {
    this.channel = channel;
    return this;
  }

  getChannel(): ParamChannel {
    return this.channel;
  }

  setProducer(producer: ParamProducer): this {
    this.producer = producer;
    return this;
  }

  getProducer(): ParamProducer {
    return this.producer;
  }
}
