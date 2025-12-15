import type {
  Alias,
  Chain,
  ComponentParamsSchema,
  ChannelParamSpecs,
  IParam,
  IParams,
  ParamChannel,
} from "@dqm/package-dqm-api-v2";
import { assertExists, dependsOn, rejectValues } from "@dqm/package-dqm-utils";
import { ParamsChannelLib } from "./params-channel-lib.mjs";
import { CommonTransports } from "../../nodes/common-transports.mjs";

type Libs = Map<ParamChannel, ParamsChannelLib>;

export class ParamsLib extends CommonTransports implements IParams {
  private schema!: ComponentParamsSchema;
  private paramsMap: Libs = new Map();

  @dependsOn("schema")
  pushParam(user: IParam): this {
    const channel = user.getChannel();
    const lib = this.paramsMap.get(channel)!;
    lib.addParam(user);
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
  findById(channel: ParamChannel, id: Alias | Chain): IParam | never {
    const lib = this.paramsMap.get(channel)!;
    assertExists(lib, { channel, id });
    return lib.findById(id);
  }

  getChannelCompilationByChannelName<T>(channel: ParamChannel): T {
    try {
      return this.paramsMap.get(channel)!.getCompilation<T>();
    } catch (e) {
      return {} as T;
    }
  }
}
