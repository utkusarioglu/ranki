import type {
  CommonTransportsConstructorParams,
  ConfigName,
  DqmConfig,
  ICommonTransports,
  IConfig,
  IPlugins,
  UniqueValue,
} from "@dqm/package-dqm-api-v2";
import { rejectValues } from "@dqm/package-dqm-utils";
import { Unique } from "../unique/unique.mjs";
import { DEFAULT_CONFIG_NAME, INITIAL_CONFIG_NAME } from "../constants.mjs";

export interface ITransports {
  config: IConfig;
  plugins: IPlugins;
}

export class CommonTransports implements ICommonTransports {
  private unique: UniqueValue;
  private config: IConfig;
  private plugins: IPlugins;

  constructor({ plugins, config }: CommonTransportsConstructorParams) {
    this.unique = Unique.getNewUnique(this);
    this.plugins = plugins;
    this.config = config;
  }

  getInitialConfig(): DqmConfig {
    return this.getConfig().getConfig<DqmConfig>(INITIAL_CONFIG_NAME);
  }

  getDefaultConfig(): DqmConfig {
    return this.getConfig().getConfig<DqmConfig>(DEFAULT_CONFIG_NAME);
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
