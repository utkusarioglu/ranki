import type {
  AnimatableStylesConfigKeyframes,
  AnimationBlockSets,
  AnimationOptions,
  AnimationRoot,
  AnimationTarget,
  ApplyRootParams,
  LayoutParsed,
  LayoutParsedSets,
  LayoutSetsInform,
  ParseRootParams,
} from "_controllers/geometry/animator/animator.types.mjs";
import type {
  GeometrySetName,
  InformContext,
  InformedChildStyle,
  UpdateStyle,
} from "../controller/geometry-controller.types.mts";
import { Parser } from "expr-eval";

const parser = new Parser();

export class LayoutParser {
  static parse(p: ParseRootParams): LayoutParsed {
    const targets = p.block.sets
      ? this.parseSets(p.block.sets, p.curr, p.prev)
      : undefined;
    const then = p.block.then
      ? this.parse({
          block: p.block.then,
          curr: p.curr,
          prev: p.prev,
        })
      : undefined;
    return {
      root: p.block.root?.map((r) => this.parseRoot(r, p.curr, p.prev)),
      sets: targets,
      then,
    };
  }

  private static parseSet(
    setName: GeometrySetName,
    t: AnimationTarget,
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
  ): LayoutSetsInform {
    const then: LayoutParsed | undefined = t.then
      ? this.parse({
          block: t.then,
          curr,
          prev,
        })
      : undefined;
    return {
      wait: this.evalOptionValue(curr.context, t.wait),
      props: {
        setName,
        container: {
          style: this.evalKeyframe(curr, prev, t.inform),
        },
        // curr: {
        //   container: curr.item,
        // },
        // prev: prev ? { container: prev.item } : undefined,
        // inform: t.inform,
      },
      then,
    };
  }

  private static parseSets(
    targets: AnimationBlockSets,
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
  ): LayoutParsedSets {
    const ent = Object.entries(targets).map(([id, v]) => [
      id,
      this.parseSet(id, v, curr, prev),
    ]);
    return Object.fromEntries(ent);
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
        STAGGER_INDEX: context.stagger,
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
  ): ApplyRootParams {
    return {
      apply: {
        name: b.name,
        keyframes: b.keyframes.map((k) => this.evalKeyframe(curr, prev, k)),
        options: this.evalOptions(b, curr.context),
      },
      then: b.then && this.parse({ curr, prev, block: b.then }),
    };
  }

  // TODO why is this accessed from geometry controller?
  static evalKeyframe(
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
    b: AnimatableStylesConfigKeyframes,
  ): Omit<UpdateStyle, "type"> {
    const entries = Object.entries(b).map(([k, v]) => [
      k,
      this.evalConfigValue(curr, prev, v),
    ]);
    return Object.fromEntries(entries);
  }

  private static try<T>(b: T, f: (b: NonNullable<T>) => number | undefined) {
    try {
      const v = f(b as NonNullable<T>);
      return v !== undefined ? v : 0;
    } catch (e) {
      return 0;
    }
  }

  private static evalConfigValue(
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
    value: string | number | undefined,
  ) {
    if (typeof value === "number" || typeof value === "undefined") {
      return value;
    }
    const exp = parser.parse(value);
    const varSet = {
      CONTAINER_HEIGHT: this.try(curr, (c) => c.container.style.height),
      CONTAINER_WIDTH: this.try(curr, (c) => c.container.style.width),
      CONTAINER_TOP: this.try(curr, (c) => c.container.style.top),
      CONTAINER_LEFT: this.try(curr, (c) => c.container.style.left),

      CONTAINER_PREV_HEIGHT: this.try(prev, (p) => p.container.style.height),
      CONTAINER_PREV_WIDTH: this.try(prev, (p) => p.container.style.width),
      CONTAINER_PREV_TOP: this.try(prev, (p) => p.container.style.top),
      CONTAINER_PREV_LEFT: this.try(prev, (p) => p.container.style.left),

      LEFT: this.try(curr, (c) => c.item.style.left),
      TOP: this.try(curr, (c) => c.item.style.top),
      WIDTH: this.try(curr, (c) => c.item.style.width),
      HEIGHT: this.try(curr, (c) => c.item.style.height),
    };
    return exp.evaluate(varSet);
  }
}
