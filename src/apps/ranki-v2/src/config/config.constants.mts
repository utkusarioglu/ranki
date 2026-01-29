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
      Q: [],
      N: [],
    },
    dev: {
      persist: false,
      methods: false,
    },
    address: {
      tokens: {
        separator: "::",
        hide: "•",
        trim: "⨯",
      },
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
        name: "clown-college" as RankiIndicatorName,
        style:
          "conic-gradient(from 31deg at 80% 65%, rgb(var(--scheme-red-1)) 121deg, rgb(var(--scheme-blue-1)) 0% 50%,       rgb(var(--scheme-green-1)) 0% calc(180deg + 121deg), rgb(var(--scheme-purple-1)) 0%)",
      },
      {
        name: "colorful" as RankiIndicatorName,
        style: `
radial-gradient(
  120% 120% at 12% 18%,
  rgb(var(--scheme-red-1)) 0%,
  transparent 52%
),
radial-gradient(
  110% 110% at 88% 82%,
  rgb(var(--scheme-orange-1)) 0%,
  transparent 58%
),
linear-gradient(
  135deg,
  transparent 0%,
  rgb(var(--scheme-green-1)) 33%,
  transparent 66%
),
linear-gradient(
  315deg,
  transparent 0%,
  rgb(var(--scheme-blue-1)) 38%,
  transparent 72%
),
repeating-linear-gradient(
  0deg,
  transparent 0px,
  transparent 22px,
  rgb(var(--scheme-purple-1)) 23px,
  transparent 26px
)
`
          .replace(/\s+/g, " ")
          .trim(),
      },
      {
        name: "checkered" as RankiIndicatorName,
        style: `repeating-conic-gradient(rgb(var(--scheme-blue-2)) 0 25%, transparent 0 50%) 50% / 15vmin 15vmax`,
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
  cards: [
    {
      exact: "AB",
      config: {
        faces: {
          Q: ["A"],
          N: ["A", `${RANKI_INTERNAL_FACE_PREFIX}:rule`, "B"],
        },
      },
    },
    {
      exact: "BA",
      config: {
        faces: {
          Q: ["B"],
          N: ["B", `${RANKI_INTERNAL_FACE_PREFIX}:rule`, "A"],
        },
      },
    },
  ],
  types: [],
  faces: [],
  tags: [
    {
      exact: "+r::dev::methods",
      cue: {
        message: "",
        // bgColor: "red-0",
        icon: "codesandbox-logo",
        // textColor: "orange-2",
        iconColor: "red-2",
      },
      config: {
        dev: {
          methods: true,
        },
      },
    },
    {
      exact: "+r::dev::persist",
      cue: {
        message: "",
        // bgColor: "red-0",
        icon: "diamonds-four",
        // textColor: "orange-2",
        iconColor: "red-2",
      },
      config: {
        dev: {
          persist: true,
        },
      },
    },
  ],
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
