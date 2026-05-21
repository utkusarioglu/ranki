import { Parser } from "expr-eval";
import type {
  AnimateableStylesConfigKeyframes,
  AnimationOptions,
  AnimationRoot,
  DecodeParams,
} from "./geometry.animator.types.mts";
import type { UpdateStyle, InformContext } from "./geometry.types.mts";
import { TimingUtils } from "_utils/timing.mjs";

const parser = new Parser();

export class AnimationUtils {
  static evalKeyframe(
    curr: UpdateStyle,
    prev: UpdateStyle | null,
    context: InformContext,
    b: AnimateableStylesConfigKeyframes,
  ) {
    const entries = Object.entries(b).map(([k, v]) => [
      k,
      AnimationUtils.evalConfigValue(curr, prev, context, v),
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
    curr: UpdateStyle,
    prev: UpdateStyle | null,
    context: InformContext,
    v: string | number | undefined,
  ) {
    if (typeof v === "number" || typeof v === "undefined") {
      return v;
    } else {
      const exp = parser.parse(v);
      const varSet = {
        CONTAINER_HEIGHT: AnimationUtils.try(curr, (c) => c.height),
        CONTAINER_WIDTH: AnimationUtils.try(curr, (c) => c.width),
        CONTAINER_TOP: AnimationUtils.try(curr, (c) => c.top),
        CONTAINER_LEFT: AnimationUtils.try(curr, (c) => c.left),

        CONTAINER_PREV_HEIGHT: AnimationUtils.try(prev, (p) => p.height),
        CONTAINER_PREV_WIDTH: AnimationUtils.try(prev, (p) => p.width),
        CONTAINER_PREV_TOP: AnimationUtils.try(prev, (p) => p.top),
        CONTAINER_PREV_LEFT: AnimationUtils.try(prev, (p) => p.left),

        LEFT: AnimationUtils.try(curr, (c) => c.lefts[context.index]),
        TOP: AnimationUtils.try(curr, (c) => c.tops[context.index]),
        WIDTH: AnimationUtils.try(curr, (c) => c.widths[context.index]),
        HEIGHT: AnimationUtils.try(curr, (c) => c.heights[context.index]),
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
        MUTATE_INDEX: context.diff.mutateIndex,
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
        AnimationUtils.evalOptionValue(context, r[k as keyof AnimationOptions]),
      ])
      .filter((v) => v[1] !== undefined) as [string, number][];
    return Object.fromEntries<number>(entries) as Partial<AnimationOptions>;
  }

  static async decode(p: DecodeParams): Promise<void> {
    await Promise.all([
      AnimationUtils.decodeRoot(p),
      AnimationUtils.decodeTargets(p),
    ]);
    if (!p.block.then) return;
    await AnimationUtils.decode({ ...p, block: p.block.then });
  }

  private static async decodeTargets(p: DecodeParams): Promise<void> {
    if (!p.block.targets) {
      return Promise.resolve();
    }
    await Promise.all(
      Object.entries(p.block.targets).map(
        async ([id, { wait, inform, then }]) => {
          await TimingUtils.delay(wait || 0);
          await p.informTarget({ id, curr: p.curr, prev: p.prev, inform });
          if (!then) return;
          await AnimationUtils.decode({ ...p, block: then });
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
            AnimationUtils.evalKeyframe(p.curr, p.prev, p.context, k),
          ),
          options: AnimationUtils.evalOptions(b, p.context),
        });
        if (!b.then) return;
        await AnimationUtils.decode({ ...p, block: b.then });
      }),
    );
  }
}
