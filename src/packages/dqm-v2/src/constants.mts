import type { DqmConfig } from "@ranki/package-dqm-api-v2";

export const DEFAULT_CONFIG: DqmConfig = {
  stage: "transform",
  grammar: {
    tokens: {},
  },
  content: {
    prefix: "",
    suffix: "",
  },
  plugins: {
    standards: ["ConstantsV2", "BaseV2"],
    requested: [],
    config: {},
    // config: pluginConfig.config,
  },
};
