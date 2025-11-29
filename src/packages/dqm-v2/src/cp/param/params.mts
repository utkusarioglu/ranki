import type {
  Alias,
  Chain,
  ComponentParamsSchema,
  ChannelParamSpecs,
  IParam,
  IParams,
  ParamChannel,
} from "@ranki/package-dqm-api-v2";
import { dependsOn, nonNullable } from "../../decorators.mjs";
import { ChannelParams } from "./channel-params.mjs";

type Libs = Map<ParamChannel, ChannelParams>;

export class Params implements IParams {
  private schema!: ComponentParamsSchema;
  private libs: Libs = new Map();

  @dependsOn("schema")
  addParam(user: IParam): IParams {
    const channel = user.getChannel();
    const lib = this.libs.get(channel)!;
    lib.addParam(user);
    return this;
  }

  setSchema(schema: ComponentParamsSchema): IParams {
    this.schema = schema;
    this.processSchema();
    return this;
  }

  private processSchema() {
    Object.entries(this.schema).forEach((v) => {
      const channel = v[0] as ParamChannel;
      const specs = v[1] as ChannelParamSpecs;
      const cp = new ChannelParams(channel).setSchema(specs);
      this.libs.set(channel, cp);
    });
  }

  getSchema(): ComponentParamsSchema {
    return this.schema;
  }

  @dependsOn("schema")
  @nonNullable
  findById(channel: ParamChannel, id: Alias | Chain): IParam | never {
    const lib = this.libs.get(channel)!;
    return lib.findById(id);
  }
}
