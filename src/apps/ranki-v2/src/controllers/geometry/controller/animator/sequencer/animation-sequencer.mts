import type {
  ApplyRootParams,
  LayoutParsed,
  LayoutParsedSets,
  LayoutSetsInform,
} from "../types/animator.types.mjs";
import type { AnimationSequencerCallbacks } from "./animation-sequencer.types.mjs";

import { O11y } from "../../../o11y/o11y.mjs";
import { TimingUtils } from "../../utils/timing.utils.mjs";

export class AnimationSequencer {
  private readonly callbacks: AnimationSequencerCallbacks;
  private readonly o11y: O11y<this>;

  constructor(callbacks: AnimationSequencerCallbacks) {
    this.callbacks = callbacks;
    this.o11y = new O11y(this, {
      tracer: {
        nameFormat: ({ name, getParentContextValue }) =>
          [
            getParentContextValue("html.element.tag"),
            getParentContextValue("geometry.action"),
            name,
          ].join(":"),
      },
    });
  }

  public async build(a: LayoutParsed): Promise<void> {
    await this.sequenceThen(a);
  }

  private async sequenceCurrent(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
    return this.o11y.trace.span("sequenceCurrent", async () => {
      await Promise.all([
        O11y.debug.pause(),
        this.sequenceRoots(a.root),
        this.sequenceSets(a.sets),
      ]);
    });
  }

  /**
   * @dev
   * #1 BUG Zone.js bug causes context to be lost after `await
   * this.callbacks.playName`. The problem is the `await`. It even breaks with
   * `await Promise.resolve()`. The context is forced onto this call because of
   * that bug. If the bug is ever resolved, you won't need `context.with`.
   */
  private async sequenceRoot(p: ApplyRootParams) {
    return this.o11y.trace.span("sequenceRoot", async ({ span, withCtx }) => {
      span.addEvent("playName.start");
      await this.callbacks.playName(p.apply);
      span.addEvent("playName.end & pause.start");
      await O11y.debug.pause();
      span.addEvent("pause.end & sequenceThen.start");
      await withCtx(() => this.sequenceThen(p.then)); // #1
      span.addEvent("sequenceThen.end");
    });
  }

  private async sequenceRoots(
    roots: ApplyRootParams[] | undefined,
  ): Promise<void> {
    if (!roots) return Promise.resolve();
    return this.o11y.trace.span("sequenceRoots", async () => {
      await Promise.all(roots.map((p) => this.sequenceRoot(p)));
    });
  }

  private async sequenceSet({ props, then, wait }: LayoutSetsInform) {
    return this.o11y.trace.span("sequenceSet", async ({ span, withCtx }) => {
      span.addEvent("delay.start");
      if (wait) await TimingUtils.delay(wait);
      span.addEvent("delay.end & pause.start");
      await O11y.debug.pause();
      span.addEvent("pause.end & informSet.start");
      await withCtx(() => this.callbacks.informSet(props));
      span.addEvent("informSet.end");
      await O11y.debug.pause();
      span.addEvent("pause.end & sequenceThen.start");
      await this.sequenceThen(then);
      span.addEvent("sequenceThen.end");
    });
  }

  private async sequenceSets(l: LayoutParsedSets | undefined): Promise<void> {
    if (!l) return Promise.resolve();
    return this.o11y.trace.span("sequenceSets", async () => {
      await Promise.all(Object.values(l).map(async (v) => this.sequenceSet(v)));
    });
  }

  private async sequenceThen(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
    return this.o11y.trace.span("sequenceThen", async ({ span }) => {
      await this.sequenceCurrent(a);
      span.addEvent("sequence.current");
      await O11y.debug.pause();
      span.addEvent("debug.pause");
      await this.sequenceThen(a.then);
      span.addEvent("sequence.then");
    });
  }
}
