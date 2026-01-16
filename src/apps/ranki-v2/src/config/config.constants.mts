import type {
  RankiGlobalConfig,
  RankiGlobalConfigPartial,
} from "../types/config.types.mjs";

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
    question: ["A"],
    answer: ["A", "ranki:hr", "B"],
    scheme: "system",
    theme: "gray",
    layout: "row",
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
    mark: {
      message: "Study",
      indicator: "none",
    },
    hud: {
      order: ["parser", "card", "address", "review", "tags"],
    },
    dqm: [],
  },
  decks: [],
  cards: [],
  tags: [],
};
