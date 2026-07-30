import type {
  CurrentAppliedStyle,
  InformContext,
  UpdateStyle,
} from "../../../types/geometry-controller.types.mts";
import type {
  AnimationRoot,
  AnimationOptions,
  AnimatableStylesConfigKeyframes,
} from "../../animator.types.mts";
import { parser } from "../layout-parser.mjs";

export class KeyframeParser {
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
        STAGGER_INDEX: context.stagger,
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

  private static try<T>(b: T, f: (b: NonNullable<T>) => number | undefined) {
    try {
      const v = f(b as NonNullable<T>);
      return v !== undefined ? v : 0;
    } catch (e) {
      return 0;
    }
  }

  // TODO why is this accessed from geometry controller?
  static evalKeyframe(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
    b: AnimatableStylesConfigKeyframes,
  ): Omit<UpdateStyle, "type"> {
    const entries = Object.entries(b).map(([k, v]) => [
      k,
      this.evalConfigValue(curr, prev, v),
    ]);
    return Object.fromEntries(entries);
  }

  private static evalConfigValue(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
    value: string | number | undefined,
  ) {
    if (typeof value === "number" || typeof value === "undefined") {
      return value;
    }
    const exp = parser.parse(value);
    const varSet = {
      TO: {
        CONTAINER: {
          HEIGHT: this.try(curr, (c) => c.container.style.height),
          WIDTH: this.try(curr, (c) => c.container.style.width),
          TOP: this.try(curr, (c) => c.container.style.top),
          LEFT: this.try(curr, (c) => c.container.style.left),
        },
        SELF: {
          LEFT: this.try(curr, (c) => c.item.style.left),
          TOP: this.try(curr, (c) => c.item.style.top),
          WIDTH: this.try(curr, (c) => c.item.style.width),
          HEIGHT: this.try(curr, (c) => c.item.style.height),
        },
      },

      FROM: {
        CONTAINER: {
          HEIGHT: this.try(prev, (p) => p.container.style.height),
          WIDTH: this.try(prev, (p) => p.container.style.width),
          TOP: this.try(prev, (p) => p.container.style.top),
          LEFT: this.try(prev, (p) => p.container.style.left),
        },
        SELF: {
          LEFT: this.try(prev, (c) => c.item.style.left),
          TOP: this.try(prev, (c) => c.item.style.top),
          WIDTH: this.try(prev, (c) => c.item.style.width),
          HEIGHT: this.try(prev, (c) => c.item.style.height),
        },
      },
      // CONTAINER_HEIGHT: this.try(curr, (c) => c.container.style.height),
      // CONTAINER_WIDTH: this.try(curr, (c) => c.container.style.width),
      // CONTAINER_TOP: this.try(curr, (c) => c.container.style.top),
      // CONTAINER_LEFT: this.try(curr, (c) => c.container.style.left),

      // CONTAINER_PREV_HEIGHT: this.try(prev, (p) => p.container.style.height),
      // CONTAINER_PREV_WIDTH: this.try(prev, (p) => p.container.style.width),
      // CONTAINER_PREV_TOP: this.try(prev, (p) => p.container.style.top),
      // CONTAINER_PREV_LEFT: this.try(prev, (p) => p.container.style.left),
      // TO: {
      // },
    };
    return exp.evaluate(varSet);
  }
}
