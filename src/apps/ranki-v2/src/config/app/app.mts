import type { ProcessedCue, ProcessedCueMap } from "_config/config.types.mjs";
import type {
  BuildRankiBaseConfigReturn,
  RankiAnimation,
  RankiState,
} from "_config/config.types.mjs";

import { SYSTEM_CONTROLLED_SCHEME_TOKEN } from "_config/config.constants.mjs";
import { assertNotNull } from "_error/assertions.mjs";

import { HudConfig } from "./HudConfig.mjs";
import { IndicatorConfig } from "./IndicatorConfig.mjs";
import { ChallengeConfig } from "./ChallengeConfig.mjs";
import { DesignConfig } from "./DesignConfig.mjs";
import type { RankiHudStateAnimation } from "_components/hud/hud.types.mjs";
import type {
  AppConfigCreateParams,
  AppConfigBuildParams,
} from "./app.types.mjs";

export class AppConfig {
  public static create({
    collected,
    raw,
  }: AppConfigCreateParams): null | RankiState {
    assertNotNull(raw, {
      why: "Raw fields shouldn't be null at this stage of resolution",
    });
    return collected === null ? null : this.build({ collected, raw });
  }

  private static build(p: AppConfigBuildParams): RankiState {
    const hudAnimation = getAnimation(p.collected.base, "hud");

    const scheme = this.scheme(p);
    const cues = this.cues(p, hudAnimation);
    const hud = HudConfig.build(p, cues, hudAnimation);
    const indicator = IndicatorConfig.build(p, cues);
    const challenge = ChallengeConfig.build(p, scheme);
    const design = DesignConfig.build(p, scheme);

    return {
      challenge,
      design,
      dev: p.collected.base.config.dev,
      hud,
      indicator,
    };
  }

  private static scheme({ collected: { base }, raw }: AppConfigBuildParams) {
    return base.config.design.scheme === SYSTEM_CONTROLLED_SCHEME_TOKEN
      ? raw.htmlAttr.scheme
      : base.config.design.scheme;
  }

  /**
   * @dev
   * #1 Becomes an icon or color only chip at the start of cue hud
   * #2 Becomes a text (and icon) based chip on the right side of the cue hud
   * #3 Becomes an indicator in the background
   */
  private static cues(
    {
      collected: {
        base: { cueRecord },
      },
    }: AppConfigBuildParams,
    animation: RankiHudStateAnimation,
  ): ProcessedCueMap {
    const badges: ProcessedCue[] = [];
    const chips: ProcessedCue[] = [];
    const labels: ProcessedCue[] = [];
    const indicators: ProcessedCue[] = [];

    cueRecord.forEach((c) => {
      const icon = !!c.icon && !!c.icon.id && c.icon.id !== "none";
      const message =
        !!c.message && !!c.message.text && c.message.text !== "none";
      const background = !!c.background && c.background.color !== "none";
      const indicator = !!c.indicator && c.indicator !== "none";
      const badge = (icon || background) && !message; // #1
      const chip = icon && message; // #2
      const label = message && !icon;
      if (badge) {
        badges.push({ animation, ...c });
      }
      if (indicator) {
        indicators.push({ animation, ...c });
      }
      if (chip) {
        chips.push({ animation, ...c });
      }
      if (label) {
        labels.push({ animation, ...c });
      }
    });

    return {
      hud: {
        animation,
        count: badges.length + chips.length + labels.length,
        subtree: {
          badges,
          chips,
          labels,
        },
      },
      indicators,
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
