import type {
  RankiAppTheme,
  RankiBaseConfig,
  RankiIndicatorName,
  RankiPalette,
  RankiTagPrefix,
} from "_config/config.types.mjs";

import { NONE_TOKEN } from "../../../config.constants.mjs";
import { BASE_ANIMATIONS } from "./BASE_ANIMATIONS.mjs";
import { BASE_DQM_CONFIG } from "./BASE_DQM_CONFIG.mjs";
import { BASE_FLAGS } from "./BASE_FLAGS.mjs";
import { BASE_INDICATORS } from "./BASE_INDICATORS.mjs";

export const BASE: RankiBaseConfig = {
  address: {
    segments: [],
    tokens: {
      hide: "•",
      separator: "::",
      trim: "⨯",
    },
  },
  animations: BASE_ANIMATIONS,
  design: {
    animation: {
      challenge: {
        duration: 4e2,
        enabled: true,
        preset: "default",
      },
      enabled: true,
      // preset: "default",
      // duration: 4e2,
      // TODO this needs to go. it's used in indicator (at least)
      fade: "2s",
      hud: {
        duration: 4e2,
        enabled: true,
        preset: "default",
      },
      indicator: {
        duration: 4e2,
        enabled: true,
        preset: "default",
      },
    },
    layout: "row",
    palette: "generated-default" as RankiPalette,
    scheme: "system",
    theme: "utku" as RankiAppTheme,
  },
  dev: {
    methods: false,
    persist: false,
    throw: false,
  },
  dqm: [BASE_DQM_CONFIG],
  faces: {
    N: [],
    Q: [],
  },
  flags: BASE_FLAGS,
  hud: {
    order: ["notify", "cues", "address", "template", "tags"],
    // order: ["notify", "cues", "address", "template"],
    visibility: "visible",
  },
  indicators: BASE_INDICATORS,
  palettes: [
    {
      hues: {
        blue: 210,
        green: 130,
        magenta: 320,
        orange: 40,
        purple: 270,
        red: 0,
        turquoise: 170,
        yellow: 55,
      },
      lightness: [15, 20, 30, 60, 70, 80],
      name: "generated-default",
      saturation: [70, 70, 70, 70, 70, 70],
    },
  ],
  tags: {
    marked: {
      background: {
        color: "blue-2",
      },
      indicator: NONE_TOKEN as RankiIndicatorName,
      message: {
        text: "Study",
      },
    },
    ranki: {
      hide: true,
      prefix: "+r:" as RankiTagPrefix,
    },
  },
};
