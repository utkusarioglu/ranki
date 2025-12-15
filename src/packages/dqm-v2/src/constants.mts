import type { Alias, DqmConfig } from "@dqm/package-dqm-api-v2";

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
  },
};

export const POSITIONAL_PARAM: Alias = ["$POSITIONAL$"];
