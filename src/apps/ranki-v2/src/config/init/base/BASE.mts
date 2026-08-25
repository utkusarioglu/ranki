import type {
  RankiBaseConfig,
  RankiPalette,
  RankiAppTheme,
  RankiTagPrefix,
  RankiIndicatorName,
} from "_config/config.types.mjs";
import { BASE_FLAGS } from "./BASE_FLAGS.mjs";
import { NONE_TOKEN } from "../../config.constants.mjs";
import { BASE_DQM_CONFIG } from "./BASE_DQM_CONFIG.mjs";
import { BASE_INDICATORS } from "./BASE_INDICATORS.mjs";
import { BASE_ANIMATIONS } from "./BASE_ANIMATIONS.mjs";

export const BASE: RankiBaseConfig = {
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
      enabled: true,
      // preset: "default",
      // duration: 4e2,
      // TODO this needs to go. it's used in indicator (at least)
      fade: "2s",
      hud: {
        enabled: true,
        preset: "default",
        duration: 4e2,
      },
      challenge: {
        enabled: true,
        preset: "default",
        duration: 4e2,
      },
      indicator: {
        enabled: true,
        preset: "default",
        duration: 4e2,
      },
    },
    scheme: "system",
    palette: "generated-default" as RankiPalette,
    theme: "utku" as RankiAppTheme,
    layout: "row",
  },
  indicators: BASE_INDICATORS,
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
  animations: BASE_ANIMATIONS,
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
  flags: BASE_FLAGS,
  hud: {
    order: ["notify", "cues", "address", "template", "tags"],
    // order: ["notify", "cues", "address", "template"],
    visibility: "visible",
  },
  dqm: [BASE_DQM_CONFIG],
};
