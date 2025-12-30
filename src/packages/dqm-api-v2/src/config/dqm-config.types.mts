import type { Chain } from "../export.types.mjs";
import type { DqmGrammarTokens } from "../plugins/grammar/grammar.types.mjs";
import type { DeepPartialSerializable } from "../util.types.mjs";
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
 *
 * @dev
 * #1 TODO this is currently not factored in.
 */
export interface DqmConfig {
  stage: DqmStages;
  plugins: {
    onAbsentComponent: "fail" | "useDefaultComponent";
    onOrphanParam: "fail" | "ignore";
    configChannelToken: string;
    fallback: {
      chain: Chain;
      config: DeepPartialSerializable<DqmConfig>; // #1
    };
    default: {
      chain: Chain;
      config: DeepPartialSerializable<DqmConfig>; // #1
    };

    standards: DqmPluginName[];
    requested: DqmPluginName[];
    config: DqmPluginsConfig;
  };
  grammar: {
    tokens: DqmPluginsTokens;
  };
  content: {
    trim: boolean;
    prefix: string;
    suffix: string;
  };
}
