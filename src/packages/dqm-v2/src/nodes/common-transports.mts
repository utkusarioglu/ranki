import type {
  CommonTransportsConstructorParams,
  IConfig,
  IPlugins,
} from "@dqm/package-dqm-api-v2";
import { rejectValues } from "@dqm/package-utils";

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

  protected cloneConfig() {
    this.config = this.config.clone();
  }

  protected getTransports() {
    return {
      config: this.getConfig(),
      plugins: this.getPlugins(),
    };
  }
}
