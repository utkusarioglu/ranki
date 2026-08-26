import type { FilteredTags } from "_collect/collect.types.mjs";
import type {
  HudTagListItem,
  RankiHudState,
  RankiHudStateAnimation,
} from "_components/hud/hud.types.mjs";
import type {
  BuildRankiBaseConfigReturn,
  ProcessedCueMap,
} from "_config/config.types.mjs";

import type { AppConfigBuildParams } from "./app.types.mjs";

import { HudAddressSegmentConfig } from "./HudAddressSegment.mjs";

export class HudConfig {
  /**
   * @dev
   * #1 DECIDE Config modules in general are handling two different tasks:
   * creating config for components and actually wrangling data for them. This is
   * fine as long as the behavior is consistent. Right now, it isn't
   */
  public static build(
    p: AppConfigBuildParams,
    { hud }: ProcessedCueMap,
    animation: RankiHudStateAnimation,
  ): RankiHudState {
    const {
      collected: { base, tags: filteredTags },
      raw,
    } = p;
    const segments = HudAddressSegmentConfig.build(p); // #1
    const tags = this.buildTags(base, filteredTags, animation);
    return {
      animation,
      order: base.config.hud.order,
      subtree: {
        address: {
          animation,
          count: segments.length,
          segments,
          tokens: base.config.address.tokens,
        },
        cues: hud,
        // TODO
        notify: {
          animation,
          count: 3,
          errorLevel: "none",
          hasReplacements: true,
          parseMode: "v2",
        },
        tags,
        template: {
          animation,
          card: raw.fields.card,
          count: 3,
          face: raw.fields.face,
          type: raw.fields.type,
        },
      },
      visibility: base.config.hud.visibility,
    };
  }

  private static buildTags(
    base: BuildRankiBaseConfigReturn,
    tags: FilteredTags,
    animation: RankiHudStateAnimation,
  ) {
    const hide = base.config.tags.ranki.hide;
    const neut = tags.neutral.map((t) => ({
      animation,
      text: t,
      type: "anki" as const,
    }));
    const list: HudTagListItem[] = hide
      ? neut
      : [
          ...neut,
          ...tags.ranki.map((t) => ({
            animation,
            text: t,
            type: "ranki" as const,
          })),
        ];
    return {
      animation,
      count: list.length,
      hideRanki: base.config.tags.ranki.hide,
      list,
      neutral: tags.neutral,
      ranki: tags.ranki,
    };
  }
}
