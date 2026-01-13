import type { RankiConfig } from "./types/config.types.mts";

export const RANKI_INITIAL_CONFIG: RankiConfig = {
  base: {
    question: ["A"],
    answer: ["A", "B"],
    divider: true,
    scheme: "system",
    theme: "gray",
    layout: "row",
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
