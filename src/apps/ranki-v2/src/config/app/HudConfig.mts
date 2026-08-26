import type { FilteredTags, RawFields } from "_collect/collect.types.mjs";
import type {
  HudTagListItem,
  RankiHudState,
  RankiHudStateAnimation,
} from "_components/hud/hud.types.mjs";
import type {
  BuildRankiBaseConfigReturn,
  ProcessedCueMapHud,
} from "_config/config.types.mjs";

import { buildAddressSegments } from "./buildAddress.mjs";

export class HudConfig {
  /**
   * @dev
   * #1 DECIDE Config modules in general are handling two different tasks:
   * creating config for components and actually wrangling data for them. This is
   * fine as long as the behavior is consistent. Right now, it isn't
   */
  public static build(
    base: BuildRankiBaseConfigReturn,
    collected: RawFields,
    filteredTags: FilteredTags,
    cues: ProcessedCueMapHud,
    animation: RankiHudStateAnimation,
  ): RankiHudState {
    const segments = buildAddressSegments(
      base.config.address.tokens,
      base.config.address.segments,
      collected.fields.deck,
    ); // #1
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
        cues,
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
          card: collected.fields.card,
          count: 3,
          face: collected.fields.face,
          type: collected.fields.type,
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
