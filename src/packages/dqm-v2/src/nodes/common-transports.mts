import type {
  CommonTransportsConstructorParams,
  ConfigName,
  IConfig,
  IPlugins,
  UniqueValue,
} from "@dqm/package-dqm-api-v2";
import { rejectValues } from "@dqm/package-dqm-utils";
import { Unique } from "../unique/unique.mjs";

export interface ITransports {
  config: IConfig;
  plugins: IPlugins;
}

export class CommonTransports {
  private unique: UniqueValue;
  private config: IConfig;
  private plugins: IPlugins;

  constructor({ plugins, config }: CommonTransportsConstructorParams) {
    this.unique = Unique.getNewUnique();
    this.plugins = plugins;
    this.config = config;
  }

  @rejectValues(undefined)
  getUnique(): UniqueValue {
    return this.unique;
  }

  @rejectValues(undefined)
  protected getConfig(): IConfig {
    return this.config;
  }

  @rejectValues(undefined)
  protected getPlugins(): IPlugins {
    return this.plugins;
  }

  protected cloneConfig(name: ConfigName) {
    this.config = this.config.clone(name);
  }

  protected getTransports(): ITransports {
    return {
      config: this.getConfig(),
      plugins: this.getPlugins(),
    };
  }
}
