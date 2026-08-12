import type {
  CurrentAppliedStyle,
  InformContext,
} from "../../../types/geometry-controller.types.mjs";
import type { UpdateStyle } from "../../animator.types.mjs";
import type {
  AnimatableStylesConfigKeyframes,
  AnimationOptions,
  AnimationRoot,
} from "../../animator.types.mjs";
import { Parser } from "expr-eval";

export const parser = new Parser();

export class KeyframeParser {
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
  private static evalValue(value: number | string | undefined, varSet: any) {
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

  private static evalConfigValue(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
    value: number | string | undefined,
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
    };

    return this.evalValue(value, varSet);
  }

  private static try<T>(b: T, f: (b: NonNullable<T>) => number | undefined) {
    try {
      const v = f(b as NonNullable<T>);
      return v !== undefined ? v : 0;
    } catch (_) {
      return 0;
    }
  }
}
