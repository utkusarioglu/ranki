import type {
  AnkiFlagColors,
  RankiGlobalConfig,
  RankiGlobalConfigPartial,
} from "./config.types.mjs";
import { DQM_BASE_CONFIG } from "./dqm.constants.mts";

export const ANKI_DECK_SEPARATOR = "::";

// REMOVE
export const RANKI_UTKU_CONFIG: RankiGlobalConfigPartial = {
  base: {
    flags: {
      red: {
        message: "Questionable Information",
        indicator: "radial",
      },
      orange: {
        message: "Derive more cards",
        indicator: "none",
      },
      green: {
        message: "Needs elaboration",
        indicator: "none",
      },
      blue: {
        message: "Possibly Outdated",
        indicator: "none",
      },
      pink: {
        message: "Rendering Issues",
        indicator: "none",
      },
      turquoise: {
        message: "Too Extensive",
        indicator: "none",
      },
      purple: {
        message: "Poor Wording or Formatting",
        indicator: "none",
      },
    },
  },
};

export const RANKI_INITIAL_CONFIG: RankiGlobalConfig = {
  base: {
    faces: {
      Q: ["A"],
      N: ["A", "ranki:hr", "B"],
    },
    design: {
      scheme: "system",
      theme: "gray",
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
    marked: {
      message: "Study",
      indicator: "none",
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
