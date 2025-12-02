import type { IPlugins, IConfig } from "../export.types.mjs";

export interface CommonTransportsConstructorParams {
  plugins: IPlugins;
  config: IConfig;
}
