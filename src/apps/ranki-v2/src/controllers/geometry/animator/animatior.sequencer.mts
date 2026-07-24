import type {
  AnimationChainMakerCallbacks,
  ApplyCb,
  ApplyRootParams,
  InformTargetCb,
  LayoutParsed,
  LayoutParsedTargets,
} from "./animator.types.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";

export class AnimationSequencer {
  private readonly informTargetCb: InformTargetCb;
  private readonly applyCb: ApplyCb;

  constructor(callbacks: AnimationChainMakerCallbacks) {
    this.informTargetCb = callbacks.informTarget;
    this.applyCb = callbacks.apply;
  }

  private async sequenceTargets(
    l: LayoutParsedTargets | undefined,
  ): Promise<void> {
    if (!l) return Promise.resolve();
    await Promise.all(
      Object.values(l).map(async ({ wait, target, then }) => {
        if (wait) await TimingUtils.delay(wait);
        await this.informTargetCb(target);
        if (then) await this.sequenceThen(then);
      }),
    );
  }

  private async sequenceRoots(
    roots: ApplyRootParams[] | undefined,
  ): Promise<void> {
    if (!roots) return Promise.resolve();
    await Promise.all(
      roots.map(async (p) => {
        await this.applyCb(p.apply);
        await this.sequenceThen(p.then);
      }),
    );
  }

  private async sequenceNow(a: LayoutParsed | undefined): Promise<void> {
    await Promise.all([
      a && (await this.sequenceRoots(a.root)),
      a && (await this.sequenceTargets(a.targets)),
    ]);
  }

  private async sequenceThen(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
    await this.sequenceNow(a);
    await this.sequenceThen(a.then);
  }

  public async build(a: LayoutParsed): Promise<void> {
    await this.sequenceThen(a);
  }
}
