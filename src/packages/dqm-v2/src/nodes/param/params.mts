import type {
  Alias,
  Chain,
  ComponentParamsSchema,
  ChannelParamSpecs,
  IParam,
  IParams,
  ParamChannel,
} from "@dqm/package-dqm-api-v2";
import { assertExists, dependsOn, rejectValues } from "@dqm/package-utils";
import { ChannelParams } from "./channel-params.mjs";
import { CommonTransports } from "../common-transports.mjs";

type Libs = Map<ParamChannel, ChannelParams>;

export class Params extends CommonTransports implements IParams {
  private schema!: ComponentParamsSchema;
  private libs: Libs = new Map();

  @dependsOn("schema")
  pushParam(user: IParam): this {
    const channel = user.getChannel();
    const lib = this.libs.get(channel)!;
    lib.addParam(user);
    return this;
  }

  setSchema(schema: ComponentParamsSchema): this {
    this.schema = schema;
    this.processSchema();
    return this;
  }

  private processSchema() {
    Object.entries(this.schema).forEach((v) => {
      const channel = v[0] as ParamChannel;
      const specs = v[1] as ChannelParamSpecs;
      const cp = new ChannelParams(this.getTransports(), channel).setSchema(
        specs,
      );
      this.libs.set(channel, cp);
    });
  }

  getSchema(): ComponentParamsSchema {
    return this.schema;
  }

  @dependsOn("schema")
  @rejectValues(undefined)
  findById(channel: ParamChannel, id: Alias | Chain): IParam | never {
    const lib = this.libs.get(channel)!;
    assertExists(lib, { channel, id });
    return lib.findById(id);
  }

  buildObject<T>(channel: ParamChannel): T {
    // TODO
    if (!channel) {
      console.log({ channel, libs: this.libs });
    }
    return {
      stage: "ast",
      plugins: {
        config: {
          BaseV2: {
            tokens: {
              ignore: "meow",
            },
          },
        },
      },
    } as T;
  }
}
