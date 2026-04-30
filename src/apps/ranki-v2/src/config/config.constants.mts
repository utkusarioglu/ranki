import { FLAG_COLOR_ORDER } from "./anki.constants.mts";
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

const NONE_TOKEN = "none";

export const GLOB_SINGLE = "_";
export const GLOB_MULTI = "__";

export const RANKI_INITIAL_CONFIG: RankiChannelsConfig = {
  base: {
    faces: {
      Q: [],
      N: [],
    },
    dev: {
      throw: false,
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
          "radial-gradient(150% 107% at bottom center, transparent 90%, rgb(var(--scheme-red-2)))",
      },
      {
        name: "caution" as RankiIndicatorName,
        style: "linear-gradient(44deg, rgb(var(--scheme-red-0)), transparent)",
      },
      {
        name: "clown-college" as RankiIndicatorName,
        style:
          "conic-gradient(from 31deg at 80% 65%, rgb(var(--scheme-red-1)) 121deg, rgb(var(--scheme-blue-1)) 0% 50%, rgb(var(--scheme-green-1)) 0% calc(180deg + 121deg), rgb(var(--scheme-purple-1)) 0%)",
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
        message: {
          text: "Study",
        },
        background: {
          color: "blue-2",
        },
        indicator: NONE_TOKEN as RankiIndicatorName,
      },
    },
    flags: {
      none: {
        indicator: NONE_TOKEN as RankiIndicatorName,
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
      },
      red: {
        indicator: NONE_TOKEN as RankiIndicatorName,
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
      },
      orange: {
        indicator: NONE_TOKEN as RankiIndicatorName,
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
      },
      green: {
        indicator: NONE_TOKEN as RankiIndicatorName,
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
      },
      blue: {
        indicator: NONE_TOKEN as RankiIndicatorName,
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
      },
      pink: {
        indicator: NONE_TOKEN as RankiIndicatorName,
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
      },
      turquoise: {
        indicator: NONE_TOKEN as RankiIndicatorName,
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
      },
      purple: {
        indicator: NONE_TOKEN as RankiIndicatorName,
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
      },
    },
    hud: {
      order: ["notify", "cues", "address", "template", "tags"],
      // order: ["notify", "cues", "address", "template"],
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
  webview: [],
  tags: [
    {
      exact: "+r::dqm::ignore",
      cue: {
        icon: {
          id: "blueprint",
          color: "red-2",
        },
      },
      config: {
        dqm: [
          {
            id: "ranki-tag-dqm-ignore",
            config: {
              content: {
                prefix: "% ignore\n",
              },
            },
          },
        ],
      },
    },
    {
      exact: "+r::dev::methods",
      cue: {
        icon: {
          id: "codesandbox-logo",
          color: "red-2",
        },
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
        message: {
          text: "",
        },
        icon: {
          id: "diamonds-four",
          color: "red-2",
        },
      },
      config: {
        dev: {
          persist: true,
        },
      },
    },
    {
      exact: "+r::dev::throw",
      config: {
        dev: {
          throw: true,
        },
      },
    },
  ],
  always: [],
  // @ts-expect-error
  flags: {
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
  },
};
