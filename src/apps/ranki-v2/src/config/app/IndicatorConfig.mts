import type {
  ProcessedCueMap,
  BuildRankiBaseConfigReturn,
  RankiIndicatorState,
} from "_config/config.types.mjs";
import { getAnimation } from "./ranki-config.mjs";

export class IndicatorConfig {
  public static build(
    cues: ProcessedCueMap,
    base: BuildRankiBaseConfigReturn,
  ): RankiIndicatorState {
    const animation = getAnimation(base, "indicator");
    return {
      animation,
      cues: cues.indicators,
      indicatorCollection: base.config.indicators,
    };
  }
}
