import type {
  Alias,
  Chain,
  ComponentCustomizations,
  // ChannelParamSpecs,
  IAstParamNode,
  IParams,
  ParamChannel,
  ICpsParam,
  DqmConfig,
  UniqueValue,
  IConfig,
} from "@dqm/package-dqm-api-v2";
import {
  assertExists,
  Config,
  dependsOn,
  rejectValues,
} from "@dqm/package-dqm-utils";
import { ParamsChannelLib } from "./params-channel-lib.mjs";
import { CommonTransports } from "../../../common-transports.mjs";
import { INITIAL_CONFIG_NAME } from "../../../../constants.mjs";
import { DqmAppError } from "../../../../errors/dqm-app-error/dqm-app-error.mjs";

type ChannelsMap = Map<ParamChannel, ParamsChannelLib>;

const MERGE_TARGET = "merged";
const CHANNEL_COMPONENT_DEFAULT = "default"; // this has to coincide with the channel in component type in api repo

export class ParamsLib extends CommonTransports implements IParams {
  private customizations!: ComponentCustomizations;
  private channels: ChannelsMap = new Map();
  private componentConfig!: IConfig;

  initConfig(unique: UniqueValue): this {
    this.cloneConfig(unique.toString());
    return this;
  }

  getParams(): ICpsParam[] {
    return Array.from(this.channels.values())
      .map((v) => v.getParams())
      .flat();
  }

  @dependsOn("customizations")
  pushParam(user: IAstParamNode): this {
    const channel = user.getChannel() || CHANNEL_COMPONENT_DEFAULT;
    this.getChannel(channel).addParam(user);
    return this;
  }

  setSchema(schema: ComponentCustomizations): this {
    this.customizations = schema;
    this.processSchema();
    return this;
  }

  private processSchema() {
    Object.entries(this.customizations.params).forEach(([channel, specs]) => {
      // const channel = v[0] as ParamChannel;
      // const specs = v[1] as ChannelParamSpecs;
      const cp = new ParamsChannelLib(this.getTransports(), channel).setSchema(
        specs,
      );
      this.channels.set(channel, cp);
    });
  }

  getSchema(): ComponentCustomizations {
    return this.customizations;
  }

  @dependsOn("customizations")
  @rejectValues(undefined)
  findById(channel: ParamChannel, id: Alias | Chain): ICpsParam | never {
    return this.getChannel(channel).findById(id);
  }

  private getChannel(channel: ParamChannel) {
    const ch = this.channels.get(channel);
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
    return Array.from(this.channels.keys());
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
      this.customizations.config?.dqm?.forEach((d, i) => {
        config.pushConfig("component-base-" + i, d);
      });
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

  getDqmConfig(): DqmConfig {
    return this.getConfig().getConfig(MERGE_TARGET);
  }

  getComponentConfig<T>(): T {
    const MERGE_TARGET = "COMPONENT_CONFIG";
    this.componentConfig = new Config().pushConfig(
      "default",
      this.customizations.config.component,
    );
    for (const [channel, lib] of this.channels) {
      const entries = lib.getMutationEntries();
      entries.forEach(({ type, chainString, value }) => {
        const key = `Param:${channel}:${type}:${chainString}`;
        this.componentConfig.pushConfig(key, value);
      });
    }
    return this.componentConfig.mergeTo(MERGE_TARGET).getConfig(MERGE_TARGET);
  }
}
