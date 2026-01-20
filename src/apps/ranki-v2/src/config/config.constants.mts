import type {
  AnkiFlagColors,
  RankiAppTheme,
  RankiConfigChannels,
  RankiIndicatorName,
  RankiPalette,
  RankiTagPrefix,
} from "./config.types.mjs";
import { DQM_BASE_CONFIG } from "./dqm.constants.mts";

export const ANKI_DECK_SEPARATOR = "::";

export const RANKI_INITIAL_CONFIG: RankiConfigChannels = {
  base: {
    faces: {
      Q: ["A"],
      N: ["A", "ranki:hr", "B"],
    },
    design: {
      animation: {
        fade: "0.4s",
      },
      scheme: "system",
      palette: "generated-default" as RankiPalette,
      theme: "utku" as RankiAppTheme,
      layout: "row",
    },
    indicators: [
      {
        name: "red-arch" as RankiIndicatorName,
        style:
          "radial-gradient(118% 105% at bottom center, transparent 85%, var(--palette-red-2-hex))",
      },
    ],
    palettes: [
      {
        name: "generated-default",
        hues: {
          red: 0,
          orange: 40,
          yellow: 55,
          green: 130,
          turquoise: 170,
          blue: 210,
          purple: 270,
          magenta: 320,
        },
        lightness: [15, 20, 30, 60, 70, 80],
        saturation: [70, 70, 70, 70, 70, 70],
      },
    ],
    flags: {
      none: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      red: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      orange: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      green: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      blue: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      pink: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      turquoise: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      purple: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
    },
    tags: {
      ranki: {
        prefix: "+r:" as RankiTagPrefix,
        hide: true,
      },
      marked: {
        message: "Study",
        indicator: "none" as RankiIndicatorName,
      },
    },
    hud: {
      order: ["parser", "card", "address", "review", "tags"],
      visibility: "visible",
    },
    dqm: [DQM_BASE_CONFIG],
  },
  decks: [],
  cards: [],
  types: [],
  faces: [],
  tags: [],
};

export const FLAG_COLOR_ORDER: AnkiFlagColors[] = [
  "none",
  "red",
  "orange",
  "green",
  "blue",
  "pink",
  "turquoise",
  "purple",
];
