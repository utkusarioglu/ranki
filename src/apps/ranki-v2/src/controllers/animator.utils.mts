import { Parser } from "expr-eval";
import type {
  AnimateableStylesConfigKeyframes,
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
    return Object.fromEntries(
      Object.entries(b).map(([k, v]) => [
        k,
        AnimationUtils.evalConfigValue(curr, prev, context, v),
      ]),
    );
  }

  static evalConfigValue(
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
        CONTAINER_HEIGHT: curr.height,
        CONTAINER_TOP: curr.top,
        CONTAINER_WIDTH: curr.width,
        CONTAINER_LEFT: curr.left,
        LEFT: curr.lefts !== undefined ? curr.lefts[context.index] : 0,
        TOP: curr.tops !== undefined ? curr.tops[context.index] : 0,
        HEIGHT: curr.heights !== undefined ? curr.heights[context.index] : 0,
        WIDTH: curr.widths !== undefined ? curr.widths[context.index] : 0,
        CONTAINER_PREV_HEIGHT: prev?.height || 0,
        CONTAINER_PREV_WIDTH: prev?.width || 0,
      };
      return exp.evaluate(varSet);
    }
  }

  static evalOptions(r: AnimationRoot) {
    return {
      delay: r.delay,
      duration: r.duration,
      easing: r.easing,
    };
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
          pos: AnimationUtils.evalKeyframe(
            p.curr,
            p.prev,
            p.context,
            b.keyframes[0],
          ),
          options: AnimationUtils.evalOptions(b),
        });
        if (!b.then) return;
        await AnimationUtils.decode({ ...p, block: b.then });
      }),
    );
  }
}
