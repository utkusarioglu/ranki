import type {
  CommonTransportsConstructorParams,
  ConfigName,
  IConfig,
  IPlugins,
} from "@dqm/package-dqm-api-v2";
import { rejectValues } from "@dqm/package-dqm-utils";

export interface ITransports {
  config: IConfig;
  plugins: IPlugins;
}

export class CommonTransports {
  private config: IConfig;
  private plugins: IPlugins;

  constructor({ plugins, config }: CommonTransportsConstructorParams) {
    this.plugins = plugins;
    this.config = config;
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
