import type {
  Alias,
  Chain,
  Audience,
  IParam,
  Operator,
  ParamValueSpec,
  ParamChannel,
  ParamProducer,
  IId,
  ParamDefaultValue,
  ChannelParamSpecs,
} from "@dqm/package-dqm-api-v2";
import { Id } from "../../id/id.mjs";
import { ALL_AUDIENCES } from "./param.constants.mjs";
import { DqmError, rejectValues, dependsOn } from "@dqm/package-utils";
import { AstNode } from "../ast/ast-node.mjs";

export class Param extends AstNode implements IParam {
  private audience: Audience = ALL_AUDIENCES;
  private operator!: Operator;
  private values: ParamValueSpec[] = [];
  private defaultValues: ParamDefaultValue[] = [];
  private id = new Id();
  private specs!: ChannelParamSpecs;
  private channel!: ParamChannel;
  private producer: ParamProducer = "instance-declaration";

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

  @dependsOn("specs")
  setId(id: Alias | Chain): IParam {
    this.id.setId(id);
    return this;
  }

  getId(): IId {
    return this.id;
  }

  @dependsOn("specs", "defaultValues")
  setValues(values: ParamValueSpec[]): this {
    if (values.length > this.defaultValues.length) {
      throw new DqmError("TOO_MANY_VALUES", {
        values,
        defaults: this.defaultValues,
        obj: this,
      });
    }
    this.values = values;
    return this;
  }

  @dependsOn("specs")
  setDefaultValues(valueSpec: ParamDefaultValue[]): this {
    this.defaultValues = valueSpec;
    return this;
  }

  getValues(): ParamValueSpec[] {
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
