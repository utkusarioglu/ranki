import { Parser, type Value } from "expr-eval";

import type {
  CurrentAppliedStyle,
  InformContext,
} from "../../../types/geometry-controller.types.mjs";
import type { AnimationKeyframeStyles } from "../../types/animator.types.mjs";
import type {
  AnimatableStylesConfigKeyframes,
  AnimationOptions,
  AnimationRoot,
} from "../../types/animator.types.mjs";
import type {
  KeyframeValue,
  UnitConversionsRecord,
} from "./keyframe-parser.types.mjs";

export const parser = new Parser();

export class KeyframeParser {
  static UNIT_CONVERSIONS = {
    rem: 11,
    // root line height
    rlh: 20,
    vmax: 19,
    vmin: 10,
    wh: 17,
    wv: 13,

    // bind these later
    // swh: 1,
    // svw: 1,
    // lvw: 1,
    // lvh: 1,
    // dvh: 1,
    // dvw: 1,
  };

  static readonly unitConversions: UnitConversionsRecord = {
    rem: (v) => +v * this.UNIT_CONVERSIONS.rem,
    rlh: (v) => +v * this.UNIT_CONVERSIONS.rlh,
    vmax: (v) => +v * this.UNIT_CONVERSIONS.vmax,
    vmin: (v) => +v * this.UNIT_CONVERSIONS.vmin,
    wh: (v) => +v * this.UNIT_CONVERSIONS.wh,
    wv: (v) => +v * this.UNIT_CONVERSIONS.wv,
  };

  static evalKeyframe(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
    b: AnimatableStylesConfigKeyframes,
  ): Omit<AnimationKeyframeStyles, "type"> {
    const entries = Object.entries(b).map(([k, v]) => [
      k,
      this.evalKeyframeValue(curr, prev, v),
    ]);
    return Object.fromEntries(entries);
  }

  // TODO why is this accessed from geometry controller?
  static evalKeyframes(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
    b: AnimatableStylesConfigKeyframes[],
  ) {
    return b.map((k) => KeyframeParser.evalKeyframe(curr, prev, k));
  }

  /**
   * @dev
   * do not access this for anything other than testing
   */
  static evalKeyframeValue(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
    value: KeyframeValue,
  ) {
    const varSet = {
      from: {
        container: {
          height: this.try(prev, (p) => p.container.style.height),
          left: this.try(prev, (p) => p.container.style.left),
          top: this.try(prev, (p) => p.container.style.top),
          width: this.try(prev, (p) => p.container.style.width),
        },
        self: {
          height: this.try(prev, (c) => c.self.style.height),
          left: this.try(prev, (c) => c.self.style.left),
          top: this.try(prev, (c) => c.self.style.top),
          width: this.try(prev, (c) => c.self.style.width),
        },
      },

      to: {
        container: {
          height: this.try(curr, (c) => c.container.style.height),
          left: this.try(curr, (c) => c.container.style.left),
          top: this.try(curr, (c) => c.container.style.top),
          width: this.try(curr, (c) => c.container.style.width),
        },
        self: {
          height: this.try(curr, (c) => c.self.style.height),
          left: this.try(curr, (c) => c.self.style.left),
          top: this.try(curr, (c) => c.self.style.top),
          width: this.try(curr, (c) => c.self.style.width),
        },
      },
      ...this.unitConversions,
    };

    return this.evalValue(value, varSet);
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

  static evalOptionValue(
    context: InformContext,
    value: number | string | undefined,
  ) {
    const varSet = {
      to: {
        self: {
          index: context.index,
          length: context.length,
          stagger: context.stagger,
        },
      },
    };
    return this.evalValue(value, varSet);
  }

  /**
   * @dev
   * #1 This works because EXPR_CHAR has to be the first character after trim
   */
  private static evalValue(value: number | string | undefined, varSet: Value) {
    const EXPR_CHAR = "=";
    const isNumber = typeof value === "number";
    const isUndefined = typeof value === "undefined";
    const isString = typeof value === "string";
    const isExpr = isString && value.trim().startsWith(EXPR_CHAR);
    if (isNumber || isUndefined || !isExpr) return value;

    const trimmed = value.trim();
    const exprStr = trimmed.slice(1); // #1

    const exp = parser.parse(exprStr);
    return exp.evaluate(varSet);
  }

  private static try<T>(b: T, f: (b: NonNullable<T>) => number | undefined) {
    try {
      const v = f(b as NonNullable<T>);
      return v !== undefined ? v : 0;
    } catch {
      return 0;
    }
  }
}
