import type { RankiFlags, RankiIndicatorName } from "_config/config.types.mjs";

import { FLAG_COLOR_ORDER } from "../../../anki.constants.mjs";
import { NONE_TOKEN } from "../../config.constants.mjs";

export const FLAGS = {
  none: {
    config: {},
    cue: {
      background: {
        color: NONE_TOKEN,
      },
      icon: {
        color: NONE_TOKEN,
        id: NONE_TOKEN,
      },
      indicator: NONE_TOKEN as RankiIndicatorName,
      message: {
        color: NONE_TOKEN,
        text: "",
      },
    },
  },
  ...Object.fromEntries(
    FLAG_COLOR_ORDER.filter((v) => v !== NONE_TOKEN).map((color) => [
      color,
      {
        cue: {
          background: {
            color: `${color === "pink" ? "magenta" : color}-2`,
          },
          icon: {
            color: NONE_TOKEN,
            id: NONE_TOKEN,
          },
          indicator: NONE_TOKEN as RankiIndicatorName,
          message: {
            color: "tone-0",
            text: "",
          },
        },
      },
    ]),
  ),
} as RankiFlags;
