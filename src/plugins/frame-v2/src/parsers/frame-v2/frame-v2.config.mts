import type { FrameV2GrammarConfig } from "./frame-v2.types.mjs";

export const config: FrameV2GrammarConfig = {
  tokens: {
    pause: ",",

    opener: "[",
    closer: "]",
    separator: {
      param: "|",
    },
  },
};
