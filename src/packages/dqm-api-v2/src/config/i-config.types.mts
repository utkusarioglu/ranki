export type ConfigEntryCode = string & { type?: "ConfigEntryCode" };

export type ConfigName = string & { type?: "ConfigName" };

/**
 * Type for the config class. This type has nothing to do with the actual shape
 * of the config object. It's the interface for the class that manages the
 * config, regardless of the shape of the config
 */
export interface IConfig {
  clone(name: ConfigName): IConfig;
  getConfig<T>(code: ConfigEntryCode): T;
  hasConfig(code: ConfigEntryCode): boolean;
  setOrder(order: ConfigEntryCode[]): this;
  getOrder(): ConfigEntryCode[];
  mergeTo(code: ConfigEntryCode): this;
  pushConfig<C>(code: ConfigEntryCode, config: C): this;
  replaceConfig<C>(code: ConfigEntryCode, config: C): this;
  dropConfig(code: ConfigEntryCode): this;
  getParent(): IConfig | null;
  getName(): ConfigName;
  pushProperty(path: string, value: any): this;
}
