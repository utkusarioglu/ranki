import type { RankiFlags, RankiIndicatorName } from "_config/config.types.mjs";
import { FLAG_COLOR_ORDER } from "../../anki.constants.mjs";
import { NONE_TOKEN } from "../config.constants.mjs";

export const FLAGS = {
  none: {
    cue: {
      background: {
        color: NONE_TOKEN,
      },
      icon: {
        id: NONE_TOKEN,
        color: NONE_TOKEN,
      },
      message: {
        text: "",
        color: NONE_TOKEN,
      },
      indicator: NONE_TOKEN as RankiIndicatorName,
    },
    config: {},
  },
  ...Object.fromEntries(
    FLAG_COLOR_ORDER.filter((v) => v !== NONE_TOKEN).map((color) => [
      color,
      {
        cue: {
          indicator: NONE_TOKEN as RankiIndicatorName,
          background: {
            color: `${color === "pink" ? "magenta" : color}-2`,
          },
          message: {
            text: "",
            color: "tone-0",
          },
          icon: {
            id: NONE_TOKEN,
            color: NONE_TOKEN,
          },
        },
      },
    ]),
  ),
} as RankiFlags;
