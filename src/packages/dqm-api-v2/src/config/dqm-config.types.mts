import type { Chain, ParamChannel, PluginUrn } from "../export.types.mjs";
import type { DqmGrammarTokens } from "../plugins/grammar/grammar.types.mjs";
import type { DeepPartialSerializable } from "../util.types.mjs";
import type { ConfigEntryCode } from "./i-config.types.mjs";

type DqmStages = "ast" | "validate" | "transform";

export type DqmPluginName = DqmPluginNameR & { type?: "DqmPluginName" };
export type DqmPluginNameR = string;

export type DqmPluginParserName = DqmPluginName & {
  subType?: "DqmPluginParserName";
};

export type DqmPluginsTokens = Record<string, DqmGrammarTokens>;
export type DqmPluginsConfig = Record<string, any>;

export type DqmPluginVersion = string & { type?: "DqmPluginVersion" };

export type DqmConfigPackEntry = { id: ConfigEntryCode; config: DqmConfig };
export type DqmConfigPack = DqmConfigPackEntry[];

export type DqmConfigOnOrphanParam = "fail" | "warn" | "ignore";

export type DqmConfigOnOrphanChannel = "fail" | "warn" | "ignore";

export type DqmConfigOnAbsentComponent = "fail" | "useDefaultComponent";

export type DqmPluginsConfigDefaults = {
  // tokens: DqmPluginsTokens;
  config: DqmPluginsConfig;
};

// export type DqmConfigChannelToken = string & { type?: "DqmConfigChannelToken" };

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
    onAbsentComponent: DqmConfigOnAbsentComponent;
    onOrphanChannel: DqmConfigOnOrphanChannel;
    onOrphanParam: DqmConfigOnOrphanParam;
    configChannelToken: ParamChannel;
    fallback: {
      chain: Chain;
      config: DeepPartialSerializable<DqmConfig>; // #1
    };
    default: {
      chain: Chain;
      config: DeepPartialSerializable<DqmConfig>; // #1
    };

    standards: PluginUrn[];
    requested: PluginUrn[];
    config: DqmPluginsConfig;
  };
  content: {
    trim: boolean;
    prefix: string;
    suffix: string;
  };
}

export interface DqmInternalConfig extends DqmConfig {
  grammar: {
    tokens: DqmPluginsTokens;
  };
}
