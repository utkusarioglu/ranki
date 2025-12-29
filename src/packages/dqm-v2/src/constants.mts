import type { Alias, DqmConfig } from "@dqm/package-dqm-api-v2";

export const DEFAULT_CONFIG: DqmConfig = {
  stage: "transform",
  grammar: {
    tokens: {},
  },
  content: {
    trim: false,
    prefix: "",
    suffix: "",
  },
  plugins: {
    onAbsentComponent: "useDefaultComponent",
    onOrphanParam: "ignore",
    configChannelToken: "$",
    defaultComponent: {
      chain: ["base", "v2", "default"],
      params: [],
    },
    standards: ["grammar:ConstantsV2", "grammar:BaseV2"],
    requested: [],
    config: {},
  },
};

export const POSITIONAL_PARAM: Alias = ["$POSITIONAL$"];

export const DEFAULT_CONFIG_NAME = "default";

/**
 * Configuration created for the dqm instance creation.
 */
export const INITIAL_CONFIG_NAME = "initial";
