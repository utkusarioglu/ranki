import type {
  AnimationRoot,
  AnimationOptions,
  AnimateableStylesConfigKeyframes,
} from "../animator.types.mts";
import type { AnimatableStylesPartial } from "../style/style.types.mts";
import type { LayoutInformedChildStyle } from "../layout.types.mts";
import { parser } from "./decoder.mts";

export class ConfigEval {
  static evalOptionValue(
    context: InformContext,
    v: string | number | undefined,
  ) {
    if (typeof v === "number" || typeof v === "undefined") {
      return v;
    } else {
      const exp = parser.parse(v);
      const varSet = {
        INDEX: context.index,
        LENGTH: context.length,
        // STAGGER_FIRST: context.stagger.first,
        STAGGER_INDEX: context.stagger[context.index],
      };
      return exp.evaluate(varSet);
    }
  }

  static evalOptions(
    r: AnimationRoot,
    context: InformContext,
  ): Partial<AnimationOptions> {
    const entries = ["delay", "duration", "easing"]
      .map((k) => [
        k,
        this.evalOptionValue(context, r[k as keyof AnimationOptions]),
      ])
      .filter((v) => v[1] !== undefined) as [string, number][];
    return Object.fromEntries<number>(entries) as Partial<AnimationOptions>;
  }

  private static evalConfigValue(
    curr: LayoutInformedChildStyle,
    prev: LayoutInformedChildStyle | null,
    // context: InformContext,
    v: string | number | undefined,
  ) {
    if (typeof v === "number" || typeof v === "undefined") {
      return v;
    } else {
      const exp = parser.parse(v);
      const varSet = {
        CONTAINER_HEIGHT: this.try(curr, (c) => c.height),
        CONTAINER_WIDTH: this.try(curr, (c) => c.width),
        CONTAINER_TOP: this.try(curr, (c) => c.top),
        CONTAINER_LEFT: this.try(curr, (c) => c.left),

        CONTAINER_PREV_HEIGHT: this.try(prev, (p) => p.height),
        CONTAINER_PREV_WIDTH: this.try(prev, (p) => p.width),
        CONTAINER_PREV_TOP: this.try(prev, (p) => p.top),
        CONTAINER_PREV_LEFT: this.try(prev, (p) => p.left),

        LEFT: this.try(curr, (c) => c.lefts[context.index]),
        TOP: this.try(curr, (c) => c.tops[context.index]),
        WIDTH: this.try(curr, (c) => c.widths[context.index]),
        HEIGHT: this.try(curr, (c) => c.heights[context.index]),
      };
      return exp.evaluate(varSet);
    }
  }

  static evalKeyframe(
    curr: LayoutInformedChildStyle,
    prev: LayoutInformedChildStyle | null,
    // context: InformContext,
    b: AnimateableStylesConfigKeyframes,
  ): AnimatableStylesPartial {
    const entries = Object.entries(b).map(([k, v]) => [
      k,
      this.evalConfigValue(curr, prev, v),
    ]);
    return Object.fromEntries(entries);
  }

  private static try(b: any, f: (b: any) => number | undefined) {
    try {
      const v = f(b);
      return v !== undefined ? v : 0;
    } catch (e) {
      return 0;
    }
  }
}
