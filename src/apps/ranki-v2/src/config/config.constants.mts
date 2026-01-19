import type {
  AnkiFlagColors,
  RankiAppTheme,
  RankiGlobalConfig,
  RankiPalette,
  RankiTagPrefix,
} from "./config.types.mjs";
import { DQM_BASE_CONFIG } from "./dqm.constants.mts";

export const ANKI_DECK_SEPARATOR = "::";

export const RANKI_INITIAL_CONFIG: RankiGlobalConfig = {
  base: {
    faces: {
      Q: ["A"],
      N: ["A", "ranki:hr", "B"],
    },
    design: {
      animationDuration: "0.4s",
      scheme: "system",
      palette: "none" as RankiPalette,
      palettes: [],
      theme: "utku" as RankiAppTheme,
      layout: "row",
    },
    flags: {
      none: {
        message: "",
        indicator: "none",
      },
      red: {
        message: "",
        indicator: "none",
      },
      orange: {
        message: "",
        indicator: "none",
      },
      green: {
        message: "",
        indicator: "none",
      },
      blue: {
        message: "",
        indicator: "none",
      },
      pink: {
        message: "",
        indicator: "none",
      },
      turquoise: {
        message: "",
        indicator: "none",
      },
      purple: {
        message: "",
        indicator: "none",
      },
    },
    tags: {
      ranki: {
        prefix: "+r:" as RankiTagPrefix,
        hide: true,
      },
      marked: {
        message: "Study",
        indicator: "none",
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
