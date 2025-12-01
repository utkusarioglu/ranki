import type {
  CreateParserReturn,
  DqmConfig,
  IDqmPluginGrammar,
  IPluginLib,
} from "@dqm/package-dqm-api-v2";

export type T = IDqmPluginGrammar;

export type Criteria = {
  name: string;
  config: DqmConfig;
};

export type ILibParser = IPluginLib<T, CreateParserReturn, Criteria>;
