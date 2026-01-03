import type {
  IParser,
  DqmInternalConfig,
  IDqmPluginGrammar,
  IPluginLib,
} from "@dqm/package-dqm-api-v2";

export type Criteria = {
  // name: string;
  config: DqmInternalConfig;
};

export type ILibParser = IPluginLib<IDqmPluginGrammar, IParser, Criteria>;
