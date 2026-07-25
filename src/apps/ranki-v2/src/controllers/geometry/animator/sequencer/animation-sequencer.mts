import type {
  ApplyRootParams,
  LayoutParsed,
  LayoutParsedTargets,
} from "../animator.types.mjs";
import type { AnimationSequencerCallbacks } from "./animation-sequencer.types.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";

export class AnimationSequencer {
  private readonly callbacks: AnimationSequencerCallbacks;

  constructor(callbacks: AnimationSequencerCallbacks) {
    this.callbacks = callbacks;
  }

  private async sequenceTargets(
    l: LayoutParsedTargets | undefined,
  ): Promise<void> {
    if (!l) return Promise.resolve();
    await Promise.all(
      Object.values(l).map(async ({ wait, target, then }) => {
        if (wait) await TimingUtils.delay(wait);
        await this.callbacks.informTarget(target);
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
        await this.callbacks.play(p.apply);
        await this.sequenceThen(p.then);
      }),
    );
  }

  private async sequenceNow(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
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
