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
} from "@ranki/package-dqm-api-v2";
import { nonNullable, dependsOn } from "../../decorators.mjs";
import { Id } from "../../id/id.mjs";
import { ALL_AUDIENCES } from "./param.constants.mjs";
import { DqmError } from "@ranki/package-utils";

export class Param implements IParam {
  private audience: Audience = ALL_AUDIENCES;
  private operator!: Operator;
  private values: ParamValueSpec[] = [];
  private defaultValues: ParamDefaultValue[] = [];
  private id = new Id();
  private specs!: ChannelParamSpecs;
  private channel!: ParamChannel;
  private producer: ParamProducer = "instance-declaration";

  setSpecs(specs: ChannelParamSpecs): IParam {
    this.specs = specs;
    return this;
  }

  @nonNullable()
  getSpecs(): ChannelParamSpecs {
    return this.specs;
  }

  /**
   * Tokens like `$.key`.
   */
  @dependsOn("specs")
  setAudience(audience: Audience): never | IParam {
    this.audience = audience;
    return this;
  }

  @nonNullable()
  getAudience(): Audience {
    return this.audience;
  }

  /**
   * = += -= =+ =- etc
   */
  setOperator(operator: Operator): IParam {
    this.operator = operator;
    return this;
  }

  @nonNullable()
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

  @dependsOn("schema", "defaultValues")
  setValues(values: ParamValueSpec[]): IParam {
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

  @dependsOn("schema")
  setDefaultValues(valueSpec: ParamDefaultValue[]): IParam {
    this.defaultValues = valueSpec;
    return this;
  }

  getValues(): ParamValueSpec[] {
    return this.values;
  }

  setChannel(channel: ParamChannel): IParam {
    this.channel = channel;
    return this;
  }

  getChannel(): ParamChannel {
    return this.channel;
  }

  setProducer(producer: ParamProducer): IParam {
    this.producer = producer;
    return this;
  }

  getProducer(): ParamProducer {
    return this.producer;
  }
}
