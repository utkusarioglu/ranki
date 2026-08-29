import type {
  ComponentCustomizations,
  IAstParamNode,
  IParams,
  ParamChannel,
  ICpsParam,
  DqmConfig,
  UniqueValue,
  IConfig,
  DqmConfigOnOrphanChannel,
} from "@dqm/package-dqm-api-v2";
import { Config } from "@dqm/package-dqm-config";
import { assertExists, dependsOn, writeOnce } from "@dqm/package-dqm-utils";
import { ParamsChannelLib } from "./params-channel-lib.mjs";
import { CommonTransports } from "../../../common-transports.mjs";
import { DqmAppError } from "../../../../errors/dqm-app-error/dqm-app-error.mjs";
import { assertNever } from "../../../../errors/dqm-app-error/assertions.mjs";

type ChannelsMap = Map<ParamChannel, ParamsChannelLib>;

const CHANNEL_COMPONENT_DEFAULT: ParamChannel = "default"; // this has to coincide with the channel in component type in api repo

export class ParamsLib extends CommonTransports implements IParams {
  private customizations!: ComponentCustomizations;
  private channels: ChannelsMap = new Map();
  private componentConfig!: IConfig;
  private orphanChannels: IAstParamNode[] = [];

  initConfig(unique: UniqueValue): this {
    this.cloneConfig(unique.toString());
    return this;
  }

  getParams(): ICpsParam[] {
    return Array.from(this.channels.values())
      .map((v) => v.getParams())
      .flat();
  }

  private handleOrphanChannel(
    e: unknown,
    channel: ParamChannel,
    user: IAstParamNode,
  ) {
    const onOrphanChannel = this.getOrphanChannelChoice();
    switch (onOrphanChannel) {
      case "fail":
        throw new DqmAppError({
          code: "ORPHAN_CHANNEL",
          why: `A param has been defined in a channel that isn't supported by the component`,
          cause: e,
          details: { channel, channels: this.channels.keys() },
        });
      case "warn":
        this.orphanChannels.push(user);
        break;
      case "ignore":
        break;
      default:
        assertNever({
          why: "All possible orphan channel choices should have ben depleted",
          details: {
            onOrphanChannel,
            channel,
            channels: this.channels.keys(),
          },
        });
    }
  }

  @dependsOn("customizations")
  pushParam(user: IAstParamNode): this {
    const channel = user.getChannel() || CHANNEL_COMPONENT_DEFAULT;
    try {
      this.getChannel(channel).addParam(user);
    } catch (e) {
      this.handleOrphanChannel(e, channel, user);
    }
    return this;
  }

  @writeOnce("customizations")
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

  // @dependsOn("customizations")
  // @rejectValues(undefined)
  // findById(channel: ParamChannel, id: Alias | Chain): ICpsParam | never {
  //   return this.getChannel(channel).findById(id);
  // }

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

  getParsedDqmConfig(): DqmConfig {
    const dqmTarget = "DqmConfig:" + this.getUnique();
    const config = this.getConfig();
    if (config.hasConfig(dqmTarget)) {
      return config.getConfig(dqmTarget);
    }
    const configChannelToken = this.getConfigChannelToken();
    this.customizations.config?.dqm?.forEach((d, i) => {
      config.pushConfig("ComponentDqm:" + this.getUnique() + ":" + i, d);
    });

    const entries =
      this.getChannel(configChannelToken).getMutationEntries(false);
    entries.forEach(({ type, chainString, value }, i) => {
      const key = `Config:${type}:${chainString}:${i}`;
      config.pushConfig(key, value);
    });

    const merged = config.mergeTo(dqmTarget).getConfig<DqmConfig>(dqmTarget);
    return merged;
  }

  // getInitialDqmConfig(): DqmConfig {
  //   return this.getConfig().getConfig(INITIAL_CONFIG_NAME);
  // }

  getParsedComponentConfig<T>(): T {
    const componentTarget = "ComponentConfig:" + this.getUnique();
    if (this.componentConfig.hasConfig(componentTarget)) {
      return this.componentConfig.getConfig(componentTarget);
    }
    const configChannelToken = this.getConfigChannelToken();
    for (const [channel, lib] of this.channels) {
      if (channel === configChannelToken) {
        continue;
      }
      const entries = lib.getMutationEntries(true);
      entries.forEach(({ type, chainString, value }) => {
        const key = `Param:${channel}:${type}:${chainString}`;
        this.componentConfig.pushConfig(key, value);
      });
    }
    const merged = this.componentConfig
      .mergeTo(componentTarget)
      .getConfig<T>(componentTarget);
    return merged;
  }

  private getConfigChannelToken(): string {
    return this.getInitialConfig().plugins.configChannelToken;
  }

  private getOrphanChannelChoice(): DqmConfigOnOrphanChannel {
    return this.getInitialConfig().plugins.onOrphanChannel;
  }
}
