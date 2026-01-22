import type {
  RankiAppTheme,
  RankiChannelsConfig,
  RankiIndicatorName,
  RankiPalette,
  RankiTagPrefix,
} from "./config.types.mjs";
import { DQM_BASE_CONFIG } from "./dqm.constants.mts";

export const ANKI_DECK_SEPARATOR = "::";

export const SYSTEM_CONTROLLED_SCHEME_TOKEN = "system";

export const RANKI_INTERNAL_FACE_PREFIX = "ranki";

export const NO_FLAG_COLOR_TOKEN = "none";

export const RANKI_INITIAL_CONFIG: RankiChannelsConfig = {
  base: {
    faces: {
      Q: ["A"],
      N: ["A", `${RANKI_INTERNAL_FACE_PREFIX}:hr`, "B"],
    },
    address: {
      segments: [],
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
          "radial-gradient(150% 107% at bottom center, transparent 90%, var(--palette-red-2-hex))",
      },
      {
        name: "caution" as RankiIndicatorName,
        style: "linear-gradient(44deg, var(--palette-red-0-hex), transparent)",
      },
      {
        name: "under-construction" as RankiIndicatorName,
        style:
          "linear-gradient( 327deg, var(--palette-yellow-1-hex) 20%, transparent 21%, transparent 40%, var(--palette-yellow-1-hex) 41%, transparent 60%)",
      },
      {
        name: "chatgpt" as RankiIndicatorName,
        style: `
radial-gradient(
  120% 120% at 12% 18%,
  var(--scheme-surface-1) 0%,
  transparent 52%
),
radial-gradient(
  110% 110% at 88% 82%,
  var(--scheme-surface-2) 0%,
  transparent 58%
),
linear-gradient(
  135deg,
  transparent 0%,
  var(--scheme-surface-1) 33%,
  transparent 66%
),
linear-gradient(
  315deg,
  transparent 0%,
  var(--scheme-surface-2) 38%,
  transparent 72%
),
repeating-linear-gradient(
  0deg,
  transparent 0px,
  transparent 22px,
  var(--scheme-surface-1) 23px,
  transparent 26px
)
`
          .replace(/\s+/g, " ")
          .trim(),
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
    flags: {
      none: {
        indicator: "none" as RankiIndicatorName,
        message: "",
      },
      red: {
        indicator: "none" as RankiIndicatorName,
        message: "",
      },
      orange: {
        indicator: "none" as RankiIndicatorName,
        message: "",
      },
      green: {
        indicator: "none" as RankiIndicatorName,
        message: "",
      },
      blue: {
        indicator: "none" as RankiIndicatorName,
        message: "",
      },
      pink: {
        indicator: "none" as RankiIndicatorName,
        message: "",
      },
      turquoise: {
        indicator: "none" as RankiIndicatorName,
        message: "",
      },
      purple: {
        indicator: "none" as RankiIndicatorName,
        message: "",
      },
    },
    hud: {
      order: ["parser", "card", "address", "cues", "tags"],
      visibility: "visible",
    },
    dqm: [DQM_BASE_CONFIG],
  },
  decks: [],
  cards: [],
  types: [],
  faces: [],
  tags: [],
  flags: {
    none: {
      cue: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      config: {},
    },
    red: {
      cue: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      config: {},
    },
    orange: {
      cue: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      config: {},
    },
    green: {
      cue: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      config: {},
    },
    blue: {
      cue: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      config: {},
    },
    pink: {
      cue: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      config: {},
    },
    turquoise: {
      cue: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      config: {},
    },
    purple: {
      cue: {
        message: "",
        indicator: "none" as RankiIndicatorName,
      },
      config: {},
    },
  },
};
