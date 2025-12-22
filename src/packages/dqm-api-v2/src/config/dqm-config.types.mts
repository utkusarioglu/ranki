import type { Chain } from "../export.types.mjs";
import type { DqmGrammarTokens } from "../plugins/grammar/grammar.types.mjs";
import type { ConfigEntryCode } from "./i-config.types.mjs";

type DqmStages = "ast" | "validate" | "transform";

export type DqmPluginName = string & { type?: "DqmPluginName" };

export type DqmPluginsTokens = Record<string, DqmGrammarTokens>;
export type DqmPluginsConfig = Record<string, any>;

export type DqmPluginVersion = string & { type?: "DqmPluginVersion" };

export type DqmConfigPackEntry = { id: ConfigEntryCode; config: DqmConfig };
export type DqmConfigPack = DqmConfigPackEntry[];

export type DqmPluginsConfigDefaults = {
  tokens: DqmPluginsTokens;
  config: DqmPluginsConfig;
};

// TODO

/**
 * This is the shape of the config for the Dqm. It has nothing to do with
 * merging or managing the config. That is handled by `IConfig`
 */
export interface DqmConfig {
  stage: DqmStages;
  plugins: {
    onAbsentComponent: "fail" | "useDefaultComponent";
    defaultComponent: {
      chain: Chain;
      params: any[]; // TODO
    };
    standards: DqmPluginName[];
    requested: DqmPluginName[];
    config: DqmPluginsConfig;
  };
  grammar: {
    tokens: DqmPluginsTokens;
  };
  content: {
    prefix: string;
    suffix: string;
  };
}
