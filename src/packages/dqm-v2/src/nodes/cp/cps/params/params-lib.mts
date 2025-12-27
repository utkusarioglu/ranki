import type {
  Alias,
  Chain,
  ComponentParamsSchema,
  ChannelParamSpecs,
  IAstParamNode,
  IParams,
  ParamChannel,
  ICpsParam,
} from "@dqm/package-dqm-api-v2";
import { assertExists, dependsOn, rejectValues } from "@dqm/package-dqm-utils";
import { ParamsChannelLib } from "./params-channel-lib.mjs";
import { CommonTransports } from "../../../common-transports.mjs";

type ParamsMap = Map<ParamChannel, ParamsChannelLib>;

export class ParamsLib extends CommonTransports implements IParams {
  private schema!: ComponentParamsSchema;
  private paramsMap: ParamsMap = new Map();

  getParams(): ICpsParam[] {
    return Array.from(this.paramsMap.values())
      .map((v) => v.getParams())
      .flat();
  }

  @dependsOn("schema")
  pushParam(user: IAstParamNode): this {
    const channel = user.getChannel();
    this.getChannel(channel).addParam(user);
    return this;
  }

  setSchema(schema: ComponentParamsSchema): this {
    this.schema = schema;
    this.processSchema();
    return this;
  }

  private processSchema() {
    Object.entries(this.schema.channels).forEach((v) => {
      const channel = v[0] as ParamChannel;
      const specs = v[1] as ChannelParamSpecs;
      const cp = new ParamsChannelLib(this.getTransports(), channel).setSchema(
        specs,
      );
      this.paramsMap.set(channel, cp);
    });
  }

  getSchema(): ComponentParamsSchema {
    return this.schema;
  }

  @dependsOn("schema")
  @rejectValues(undefined)
  findById(channel: ParamChannel, id: Alias | Chain): ICpsParam | never {
    return this.getChannel(channel).findById(id);
  }

  private getChannel(channel: ParamChannel) {
    const ch = this.paramsMap.get(channel);
    assertExists(ch, {
      why: "The requested channel should exist if this method is called",
      details: { channel },
    });
    return ch;
  }

  getChannelCompilationByChannelName<T>(channel: ParamChannel): T {
    return this.getChannel(channel).getCompilation<T>();
  }

  getChannelNames(): ParamChannel[] {
    return Array.from(this.paramsMap.keys());
  }
}
