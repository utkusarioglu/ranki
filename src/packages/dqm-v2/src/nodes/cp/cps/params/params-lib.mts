import type {
  Alias,
  Chain,
  ComponentCustomizations,
  ChannelParamSpecs,
  IAstParamNode,
  IParams,
  ParamChannel,
  ICpsParam,
  DqmConfig,
  UniqueValue,
} from "@dqm/package-dqm-api-v2";
import { assertExists, dependsOn, rejectValues } from "@dqm/package-dqm-utils";
import { ParamsChannelLib } from "./params-channel-lib.mjs";
import { CommonTransports } from "../../../common-transports.mjs";
import { INITIAL_CONFIG_NAME } from "../../../../constants.mjs";
import { DqmAppError } from "../../../../errors/dqm-app-error/dqm-app-error.mjs";

type ParamsMap = Map<ParamChannel, ParamsChannelLib>;

const MERGE_TARGET = "merged";
const DEFAULT_CHANNEL = "default"; // this has to coincide with the channel in component type in api repo

export class ParamsLib extends CommonTransports implements IParams {
  private schema!: ComponentCustomizations;
  private paramsMap: ParamsMap = new Map();

  initConfig(unique: UniqueValue): this {
    this.cloneConfig(unique.toString());
    return this;
  }

  getParams(): ICpsParam[] {
    return Array.from(this.paramsMap.values())
      .map((v) => v.getParams())
      .flat();
  }

  @dependsOn("schema")
  pushParam(ast: IAstParamNode): this {
    const channel = ast.getChannel() || DEFAULT_CHANNEL;
    this.getChannel(channel).addParam(ast);
    return this;
  }

  setSchema(schema: ComponentCustomizations): this {
    this.schema = schema;
    this.processSchema();
    return this;
  }

  private processSchema() {
    Object.entries(this.schema.params).forEach((v) => {
      const channel = v[0] as ParamChannel;
      const specs = v[1] as ChannelParamSpecs;
      const cp = new ParamsChannelLib(this.getTransports(), channel).setSchema(
        specs,
      );
      this.paramsMap.set(channel, cp);
    });
  }

  getSchema(): ComponentCustomizations {
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

  getChannelCompilation<T>(channel: ParamChannel): T {
    return this.getChannel(channel).getCompilation<T>();
  }

  getChannelNames(): ParamChannel[] {
    return Array.from(this.paramsMap.keys());
  }

  createInitialConfig() {
    return this.getConfig().mergeTo(MERGE_TARGET);
  }

  createMergedConfig(): void {
    try {
      const config = this.getConfig();
      const configChannelToken =
        config.getConfig<DqmConfig>(INITIAL_CONFIG_NAME)!.plugins
          .configChannelToken;
      const componentParamConfig =
        this.getChannel(configChannelToken).getCompilation<DqmConfig>();
      config.pushConfig("cps", componentParamConfig);
      config.mergeTo(MERGE_TARGET);
    } catch (e) {
      throw new DqmAppError({
        code: "CONFIG_MERGE_FAIL",
        why: "Config merge call failed",
        cause: e,
      });
    }
  }

  getMergedConfig(): DqmConfig {
    return this.getConfig().getConfig(MERGE_TARGET);
  }
}
