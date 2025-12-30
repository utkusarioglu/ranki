import type {
  Alias,
  Chain,
  ComponentCustomizations,
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

type ChannelsMap = Map<ParamChannel, ParamsChannelLib>;

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
    this.componentConfig = new Config().pushConfig(
      "default",
      this.customizations.config.component,
    );
    Object.entries(this.customizations.params).forEach(([channel, specs]) => {
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

  getChannelNames(): ParamChannel[] {
    return Array.from(this.channels.keys());
  }

  getDqmConfig(): DqmConfig {
    const dqmTarget = "DqmConfig:" + this.getUnique();
    const config = this.getConfig();
    if (config.hasConfig(dqmTarget)) {
      return config.getConfig(dqmTarget);
    }
    const configChannelToken =
      config.getConfig<DqmConfig>(INITIAL_CONFIG_NAME)!.plugins
        .configChannelToken;

    this.customizations.config?.dqm?.forEach((d, i) => {
      config.pushConfig("ComponentDqm:" + this.getUnique() + ":" + i, d);
    });

    const entries =
      this.getChannel(configChannelToken).getMutationEntries(false);
    entries.forEach(({ type, chainString, value }) => {
      const key = `Config:${type}:${chainString}`;
      config.pushConfig(key, value);
    });

    return config.mergeTo(dqmTarget).getConfig(dqmTarget);
  }

  getInitialDqmConfig(): DqmConfig {
    return this.getConfig().getConfig(INITIAL_CONFIG_NAME);
  }

  getComponentConfig<T>(): T {
    const componentTarget = "ComponentConfig:" + this.getUnique();
    if (this.componentConfig.hasConfig(componentTarget)) {
      return this.componentConfig.getConfig(componentTarget);
    }
    const configChannelToken =
      this.getConfig().getConfig<DqmConfig>(INITIAL_CONFIG_NAME)!.plugins
        .configChannelToken;
    for (const [channel, lib] of this.channels) {
      if (channel === configChannelToken) {
        continue;
      }
      const entries = lib.getMutationEntries(true);
      console.log("et", entries);
      entries.forEach(({ type, chainString, value }) => {
        const key = `Param:${channel}:${type}:${chainString}`;
        this.componentConfig.pushConfig(key, value);
      });
    }
    return this.componentConfig
      .mergeTo(componentTarget)
      .getConfig(componentTarget);
  }
}
