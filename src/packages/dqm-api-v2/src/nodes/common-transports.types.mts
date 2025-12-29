import type { IConfig } from "../config/i-config.types.mjs";
import type { UniqueValue } from "../export.types.mjs";
import type { IPlugins } from "../plugins/plugin/plugins.types.mjs";

export interface CommonTransportsConstructorParams {
  plugins: IPlugins;
  config: IConfig;
}

export interface ICommonTransports {
  getUnique(): UniqueValue;
}
