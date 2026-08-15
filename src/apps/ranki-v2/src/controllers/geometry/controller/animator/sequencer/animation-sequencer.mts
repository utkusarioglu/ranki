import type {
  ApplyRootParams,
  LayoutParsed,
  LayoutParsedSets,
} from "../types/animator.types.mjs";
import type { AnimationSequencerCallbacks } from "./animation-sequencer.types.mjs";

import { Debug } from "../../debug/debug.mjs";
import { TimingUtils } from "../../utils/timing.utils.mjs";
import { context, trace, type Tracer } from "@opentelemetry/api";

export class AnimationSequencer {
  private readonly callbacks: AnimationSequencerCallbacks;
  private readonly tracer: Tracer;

  constructor(callbacks: AnimationSequencerCallbacks) {
    this.callbacks = callbacks;
    this.tracer = trace.getTracer("animation-sequencer");
  }

  public async build(a: LayoutParsed): Promise<void> {
    await this.sequenceThen(a);
  }

  private async sequenceCurrent(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
    return this.tracer.startActiveSpan("sequenceCurrent", async (span) => {
      try {
        await Promise.all([
          Debug.pause(),
          this.sequenceRoots(a.root),
          this.sequenceSets(a.sets),
        ]);
      } finally {
        span.end();
      }
    });
  }

  private async sequenceRoots(
    roots: ApplyRootParams[] | undefined,
  ): Promise<void> {
    if (!roots) return Promise.resolve();
    return this.tracer.startActiveSpan("sequenceRoots", async (span) => {
      try {
        await Promise.all(
          roots.map(async (p) => {
            span.addEvent("playName.start");
            await this.callbacks.playName(p.apply);
            span.addEvent("playName.end & pause.start");
            await Debug.pause();
            span.addEvent("pause.end & sequenceThen.start");
            await this.sequenceThen(p.then);
            span.addEvent("sequenceThen.end");
          }),
        );
      } finally {
        span.end();
      }
    });
  }

  private async sequenceSets(l: LayoutParsedSets | undefined): Promise<void> {
    if (!l) return Promise.resolve();
    return this.tracer.startActiveSpan("sequenceSets", async (span) => {
      const ctx = context.active();
      try {
        await Promise.all(
          Object.values(l).map(async ({ props, then, wait }) => {
            span.addEvent("delay.start");
            if (wait) await TimingUtils.delay(wait);
            span.addEvent("delay.end & pause.start");
            await Debug.pause();
            span.addEvent("pause.end & informSet.start");
            await context.with(ctx, () => this.callbacks.informSet(props));
            span.addEvent("informSet.end");
            await Debug.pause();
            span.addEvent("pause.end & sequenceThen.start");
            if (then) this.sequenceThen(then);
            span.addEvent("sequenceThen.end");
          }),
        );
      } finally {
        span.end();
      }
    });
  }

  private async sequenceThen(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
    return this.tracer.startActiveSpan("sequence.then", async (span) => {
      try {
        await this.sequenceCurrent(a);
        span.addEvent("sequence.current");
        await Debug.pause();
        span.addEvent("debug.pause");
        await this.sequenceThen(a.then);
        span.addEvent("sequence.then");
      } finally {
        span.end();
      }
    });
  }
}
