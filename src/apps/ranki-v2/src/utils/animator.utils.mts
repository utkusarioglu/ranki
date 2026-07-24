import type {
  ApplyRootParams,
  DecodeParams,
  LayoutParsed,
  LayoutParsedTargets,
} from "../controllers/geometry/animator/geometry.animator.types.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";

export class AnimatorUtils {
  private static async applyTargets(
    l: LayoutParsedTargets | undefined,
    apply: DecodeParams["apply"],
    informTarget: DecodeParams["informTarget"],
  ): Promise<void> {
    if (!l) return Promise.resolve();
    await Promise.all(
      Object.values(l).map(async ({ wait, target, then }) => {
        if (wait) await TimingUtils.delay(wait);
        await informTarget(target);
        if (then) await this.applyThen(then, apply, informTarget);
      }),
    );
  }

  private static async applyRoots(
    roots: ApplyRootParams[] | undefined,
    apply: DecodeParams["apply"],
    informTarget: DecodeParams["informTarget"],
  ): Promise<void> {
    if (!roots) return Promise.resolve();
    await Promise.all(
      roots.map(async (p) => {
        await apply(p.apply);
        await this.applyThen(p.then, apply, informTarget);
      }),
    );
  }

  static async applyNow(
    a: LayoutParsed | undefined,
    apply: DecodeParams["apply"],
    informTarget: DecodeParams["informTarget"],
  ): Promise<void> {
    await Promise.all([
      a && (await this.applyRoots(a.root, apply, informTarget)),
      a && (await this.applyTargets(a.targets, apply, informTarget)),
    ]);
  }

  private static async applyThen(
    a: LayoutParsed | undefined,
    apply: DecodeParams["apply"],
    informTarget: DecodeParams["informTarget"],
  ): Promise<void> {
    if (!a) return Promise.resolve();
    await this.applyNow(a, apply, informTarget);
    await this.applyThen(a.then, apply, informTarget);
  }

  public static async animate(
    a: LayoutParsed,
    apply: DecodeParams["apply"],
    informTarget: DecodeParams["informTarget"],
  ): Promise<void> {
    await this.applyThen(a, apply, informTarget);
  }
}
