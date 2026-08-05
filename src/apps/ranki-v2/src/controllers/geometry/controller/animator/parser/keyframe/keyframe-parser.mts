import type {
  CurrentAppliedStyle,
  InformContext,
} from "../../../types/geometry-controller.types.mjs";
import type { UpdateStyle } from "../../animator.types.mjs";
import type {
  AnimationRoot,
  AnimationOptions,
  AnimatableStylesConfigKeyframes,
} from "../../animator.types.mjs";
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
      to: {
        container: {
          height: this.try(curr, (c) => c.container.style.height),
          width: this.try(curr, (c) => c.container.style.width),
          top: this.try(curr, (c) => c.container.style.top),
          left: this.try(curr, (c) => c.container.style.left),
        },
        self: {
          left: this.try(curr, (c) => c.self.style.left),
          top: this.try(curr, (c) => c.self.style.top),
          width: this.try(curr, (c) => c.self.style.width),
          height: this.try(curr, (c) => c.self.style.height),
        },
      },

      from: {
        container: {
          height: this.try(prev, (p) => p.container.style.height),
          width: this.try(prev, (p) => p.container.style.width),
          top: this.try(prev, (p) => p.container.style.top),
          left: this.try(prev, (p) => p.container.style.left),
        },
        self: {
          left: this.try(prev, (c) => c.self.style.left),
          top: this.try(prev, (c) => c.self.style.top),
          width: this.try(prev, (c) => c.self.style.width),
          height: this.try(prev, (c) => c.self.style.height),
        },
      },
    };
    return exp.evaluate(varSet);
  }
}
