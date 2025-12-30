import type { ParamsV2GrammarConfig } from "./params-v2.types.mjs";

export const config: ParamsV2GrammarConfig = {
  tokens: {
    separator: {
      param: ",",
      keyLevel: ".",
    },
    key: {
      negation: "!",
      channels: ["$", "#"],
    },
    operators: {
      assign: "=",
      append: "+=",
      remove: "-=",
    },
  },
};
