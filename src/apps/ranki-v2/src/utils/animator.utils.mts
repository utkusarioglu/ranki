import { Parser } from "expr-eval";
import type {
  AnimateableStyles,
  AnimateableStylesConfigKeyframes,
  AnimationOptions,
  AnimationRoot,
  DecodeParams,
} from "../controllers/geometry/geometry.animator.types.mjs";
import type {
  UpdateStyle,
  InformContext,
  InformedChildStyle,
} from "../controllers/geometry/geometry.types.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";

const parser = new Parser();

export class AnimatorUtils {
  static evalKeyframe(
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
    context: InformContext,
    b: AnimateableStylesConfigKeyframes,
  ): Omit<UpdateStyle, "type"> {
    const entries = Object.entries(b).map(([k, v]) => [
      k,
      AnimatorUtils.evalConfigValue(curr, prev, context, v),
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
    v: string | number | undefined,
  ) {
    if (typeof v === "number" || typeof v === "undefined") {
      return v;
    } else {
      const exp = parser.parse(v);
      const varSet = {
        CONTAINER_HEIGHT: AnimatorUtils.try(curr, (c) => c.height),
        CONTAINER_WIDTH: AnimatorUtils.try(curr, (c) => c.width),
        CONTAINER_TOP: AnimatorUtils.try(curr, (c) => c.top),
        CONTAINER_LEFT: AnimatorUtils.try(curr, (c) => c.left),

        CONTAINER_PREV_HEIGHT: AnimatorUtils.try(prev, (p) => p.height),
        CONTAINER_PREV_WIDTH: AnimatorUtils.try(prev, (p) => p.width),
        CONTAINER_PREV_TOP: AnimatorUtils.try(prev, (p) => p.top),
        CONTAINER_PREV_LEFT: AnimatorUtils.try(prev, (p) => p.left),

        LEFT: AnimatorUtils.try(curr, (c) => c.lefts[context.index]),
        TOP: AnimatorUtils.try(curr, (c) => c.tops[context.index]),
        WIDTH: AnimatorUtils.try(curr, (c) => c.widths[context.index]),
        HEIGHT: AnimatorUtils.try(curr, (c) => c.heights[context.index]),
      };
      return exp.evaluate(varSet);
    }
  }

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
        AnimatorUtils.evalOptionValue(context, r[k as keyof AnimationOptions]),
      ])
      .filter((v) => v[1] !== undefined) as [string, number][];
    return Object.fromEntries<number>(entries) as Partial<AnimationOptions>;
  }

  static async decode(p: DecodeParams): Promise<void> {
    await Promise.all([
      AnimatorUtils.decodeRoot(p),
      AnimatorUtils.decodeTargets(p),
    ]);
    if (!p.block.then) return;
    await AnimatorUtils.decode({ ...p, block: p.block.then });
  }

  private static async decodeTargets(p: DecodeParams): Promise<void> {
    if (!p.block.targets) {
      return Promise.resolve();
    }
    await Promise.all(
      Object.entries(p.block.targets).map(
        async ([id, { wait, inform, then }]) => {
          if (wait) {
            const ev = AnimatorUtils.evalOptionValue(p.context, wait);
            await TimingUtils.delay(ev);
          }
          await p.informTarget({ id, curr: p.curr, prev: p.prev, inform });
          if (!then) return;
          await AnimatorUtils.decode({ ...p, block: then });
        },
      ),
    );
  }

  private static async decodeRoot(p: DecodeParams): Promise<void> {
    if (!p.block.root || !p.block.root.length) {
      return Promise.resolve();
    }
    await Promise.all(
      p.block.root.map(async (b) => {
        await p.apply({
          name: b.name,
          keyframes: b.keyframes.map((k) =>
            AnimatorUtils.evalKeyframe(p.curr, p.prev, p.context, k),
          ),
          options: AnimatorUtils.evalOptions(b, p.context),
        });
        if (!b.then) return;
        await AnimatorUtils.decode({ ...p, block: b.then });
      }),
    );
  }

  public static produceKeyframe({
    left,
    top,
    width,
    height,
    opacity,
    rotate,
    scale,
    offset,
    skewX,
    skewY,
    // rotate3d,
  }: AnimateableStyles): Keyframe {
    const k: Keyframe = {};
    const transform = [
      [left, `translateX(${left}px)`],
      [top, `translateY(${top}px)`],
      [skewX, `skewX(${skewX}deg)`],
      [skewY, `skewY(${skewY}deg)`],
      // [rotate3d, `rotate3d${(rotate3d || "").split(" ").join(", ")}deg`],
    ]
      .filter((v) => !!v[0])
      .map((v) => v[1]);

    if (transform.length) k.transform = transform.join(" ");
    if (width !== undefined) k.width = width + "px";
    if (height !== undefined) k.height = height + "px";
    if (rotate !== undefined) k.rotate = rotate + "deg";
    if (scale !== undefined) k.scale = scale;
    if (opacity !== undefined) k.opacity = opacity;
    if (offset !== undefined) k.offset = offset;

    return k;
  }
}
