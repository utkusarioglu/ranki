export type ConfigEntryCode = string & { type?: "ConfigEntryCode" };

/**
 * Type for the config class. This type has nothing to do with the actual shape
 * of the config object. It's the interface for the class that manages the
 * config, regardless of the shape of the config
 */
export interface IConfig {
  clone(): IConfig;
  getConfig<T>(code: ConfigEntryCode): T;
  setOrder(order: ConfigEntryCode[]): IConfig;
  getOrder(): ConfigEntryCode[];
  mergeTo(code: ConfigEntryCode): IConfig;
  pushConfig<C>(code: ConfigEntryCode, config: C): IConfig;
  replaceConfig<C>(code: ConfigEntryCode, config: C): IConfig;
  dropConfig(code: ConfigEntryCode): IConfig;
}
