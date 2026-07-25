import type {
  AnimateableStylesConfigKeyframes,
  AnimationBlockTargets,
  AnimationOptions,
  AnimationRoot,
  AnimationTarget,
  ApplyRootParams,
  LayoutParsed,
  LayoutParsedTargets,
  LayoutTargetsInform,
  ParseRootParams,
} from "_controllers/geometry/animator/animator.types.mjs";
import type {
  InformContext,
  InformedChildStyle,
  UpdateStyle,
} from "_controllers/geometry/geometry.types.mjs";
import { Parser } from "expr-eval";

const parser = new Parser();

export class LayoutParser {
  private static parseTarget(
    id: string,
    t: AnimationTarget,
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
    context: InformContext,
  ): LayoutTargetsInform {
    const then: LayoutParsed | undefined = t.then
      ? this.parse({ block: t.then, curr, prev, context })
      : undefined;
    return {
      wait: this.evalOptionValue(context, t.wait),
      target: {
        set: id,
        curr,
        prev,
        inform: t.inform,
      },
      then,
    };
  }

  private static parseTargets(
    targets: AnimationBlockTargets,
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
    context: InformContext,
  ): LayoutParsedTargets {
    const ent = Object.entries(targets).map(([id, v]) => [
      id,
      this.parseTarget(id, v, curr, prev, context),
    ]);
    return Object.fromEntries(ent);
  }

  static parse(p: ParseRootParams): LayoutParsed {
    const targets = p.block.targets
      ? this.parseTargets(p.block.targets, p.curr, p.prev, p.context)
      : undefined;
    const then = p.block.then
      ? this.parse({
          block: p.block.then,
          curr: p.curr,
          prev: p.prev,
          context: p.context,
        })
      : undefined;
    return {
      root: p.block.root?.map((r) =>
        this.parseRoot(r, p.curr, p.prev, p.context),
      ),
      targets,
      then,
    };
  }

  private static evalOptionValue(
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
        STAGGER_INDEX: context.stagger[context.index],
      };
      return exp.evaluate(varSet);
    }
  }

  private static evalOptions(
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

  private static parseRoot(
    b: AnimationRoot,
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
    context: InformContext,
  ): ApplyRootParams {
    return {
      apply: {
        name: b.name,
        keyframes: b.keyframes.map((k) =>
          this.evalKeyframe(curr, prev, context, k),
        ),
        options: this.evalOptions(b, context),
      },
      then: b.then && this.parse({ curr, prev, context, block: b.then }),
    };
  }

  // TODO why is this accessed from geometry controller?
  static evalKeyframe(
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
    context: InformContext,
    b: AnimateableStylesConfigKeyframes,
  ): Omit<UpdateStyle, "type"> {
    const entries = Object.entries(b).map(([k, v]) => [
      k,
      this.evalConfigValue(curr, prev, context, v),
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

  private static evalConfigValue(
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
    context: InformContext,
    value: string | number | undefined,
  ) {
    if (typeof value === "number" || typeof value === "undefined") {
      return value;
    }
    const exp = parser.parse(value);
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
