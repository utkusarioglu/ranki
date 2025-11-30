import type { IDqmPluginParser, IPluginLib } from "@ranki/package-dqm-api-v2";
import type { Config } from "@ranki/package-utils";

export type T = IDqmPluginParser;

export type Criteria = {
  name: string;
  config: Config<any>;
};

export type ILibParser = IPluginLib<T, T, Criteria>;
