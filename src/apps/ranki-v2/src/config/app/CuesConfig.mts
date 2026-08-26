import type { RankiHudStateAnimation } from "_components/hud/hud.types.mjs";
import type {
  CueRecord,
  ProcessedCue,
  ProcessedCueMap,
} from "_config/config.types.mjs";

export class CuesConfig {
  /**
   * @dev
   * #1 Becomes an icon or color only chip at the start of cue hud
   * #2 Becomes a text (and icon) based chip on the right side of the cue hud
   * #3 Becomes an indicator in the background
   */
  public static build(
    cueRecord: CueRecord[],
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
