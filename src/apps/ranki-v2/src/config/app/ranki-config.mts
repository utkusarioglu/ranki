import type {
  CardFaceArray,
  FilteredTags,
  RawFields,
} from "_collect/collect.types.mjs";
import type { RankiHudStateAnimation } from "_components/hud/hud.types.mjs";
import type {
  BuildRankiBaseConfigReturn,
  RankiAnimation,
  RankiAppDeterminedScheme,
  RankiState,
} from "_config/config.types.mjs";

import { DqmConfig } from "./buildDqmConfig.mjs";
import { ChallengeConfig } from "./ChallengeConfig.mjs";
import { CuesConfig } from "./CuesConfig.mjs";
import { DesignConfig } from "./DesignConfig.mjs";
import { HudConfig } from "./HudConfig.mjs";
import { IndicatorConfig } from "./IndicatorConfig.mjs";

export class RankiConfig {
  public static build(
    base: BuildRankiBaseConfigReturn,
    raw: RawFields,
    tags: FilteredTags,
    order: CardFaceArray,
    scheme: RankiAppDeterminedScheme,
  ): RankiState {
    const hudAnimation = getAnimation(base, "hud");

    const cues = CuesConfig.build(base.cueRecord, hudAnimation);
    const hud = HudConfig.build(base, raw, tags, cues.hud, hudAnimation);
    const dqm = DqmConfig.build(raw, order, base.config, scheme);
    const indicator = IndicatorConfig.build(cues, base);
    const challenge = ChallengeConfig.build(base, raw, order, dqm);
    const design = DesignConfig.build(base, scheme);

    return {
      challenge,
      design,
      dev: base.config.dev,
      hud,
      indicator,
    };
  }
}

export function getAnimation(
  base: BuildRankiBaseConfigReturn,
  type: keyof Omit<RankiAnimation, "enabled" | "fade">,
): RankiHudStateAnimation {
  const baseAnimation = base.config.design.animation.enabled === true;
  const typeAnimation = base.config.design.animation[type];
  return {
    ...typeAnimation,
    enabled: typeAnimation.enabled === true && baseAnimation,
  };
}
