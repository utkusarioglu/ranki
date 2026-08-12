import { O11y } from "_/o11y/o11y.mjs";
import { TimingUtils } from "_controllers/geometry/geometry.mjs";

import type {
  ApplyRootParams,
  LayoutParsed,
  LayoutParsedSets,
} from "../types/animator.types.mjs";
import type { AnimationSequencerCallbacks } from "./animation-sequencer.types.mjs";

export class AnimationSequencer {
  private readonly callbacks: AnimationSequencerCallbacks;

  constructor(callbacks: AnimationSequencerCallbacks) {
    this.callbacks = callbacks;
  }

  public async build(a: LayoutParsed): Promise<void> {
    await this.sequenceThen(a);
  }

  private async sequenceCurrent(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
    await Promise.all([
      O11y.pause(),
      a && this.sequenceRoots(a.root),
      a && this.sequenceSets(a.sets),
    ]);
  }

  private async sequenceRoots(
    roots: ApplyRootParams[] | undefined,
  ): Promise<void> {
    if (!roots) return Promise.resolve();
    await Promise.all(
      roots.map(async (p) => {
        await this.callbacks.playName(p.apply);
        await O11y.pause();
        await this.sequenceThen(p.then);
      }),
    );
  }

  private async sequenceSets(l: LayoutParsedSets | undefined): Promise<void> {
    if (!l) return Promise.resolve();
    await Promise.all(
      Object.values(l).map(async ({ props, then, wait }) => {
        if (wait) await TimingUtils.delay(wait);
        await O11y.pause();
        await this.callbacks.informSet(props);
        await O11y.pause();
        if (then) await this.sequenceThen(then);
      }),
    );
  }

  private async sequenceThen(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
    await this.sequenceCurrent(a);
    await O11y.pause();
    await this.sequenceThen(a.then);
  }
}
