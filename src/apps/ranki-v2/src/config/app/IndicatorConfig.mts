import type {
  ProcessedCueMap,
  RankiIndicatorState,
} from "_config/config.types.mjs";

import { getAnimation } from "./app.mjs";
import { type AppConfigBuildParams } from "./app.types.mjs";

export class IndicatorConfig {
  public static build(
    { collected: { base } }: AppConfigBuildParams,
    { indicators }: ProcessedCueMap,
  ): RankiIndicatorState {
    const animation = getAnimation(base, "indicator");
    return {
      animation,
      cues: indicators,
      indicatorCollection: base.config.indicators,
    };
  }
}
