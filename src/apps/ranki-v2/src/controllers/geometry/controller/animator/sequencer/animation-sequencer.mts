import { context, trace, type Tracer } from "@opentelemetry/api";

import type {
  ApplyRootParams,
  LayoutParsed,
  LayoutParsedSets,
  LayoutSetsInform,
} from "../types/animator.types.mjs";
import type {
  AnimationSequencerCallbacks,
  AnimationSequencerMetadata,
} from "./animation-sequencer.types.mjs";

import { O11y } from "../../../o11y/o11y.mjs";
import { TimingUtils } from "../../utils/timing.utils.mjs";

export class AnimationSequencer {
  private readonly callbacks: AnimationSequencerCallbacks;
  private metadata!: AnimationSequencerMetadata;
  private readonly tracer: Tracer;

  constructor(callbacks: AnimationSequencerCallbacks) {
    this.callbacks = callbacks;
    this.tracer = trace.getTracer(this.constructor.name);
  }

  public async build(
    a: LayoutParsed,
    metadata: AnimationSequencerMetadata,
  ): Promise<void> {
    this.metadata = metadata;
    await this.sequenceThen(a);
  }

  private async sequenceCurrent(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
    return this.tracer.startActiveSpan(
      `${this.metadata.tag}:${this.metadata.action}:sequenceCurrent`,
      async (span) => {
        try {
          await Promise.all([
            O11y.debug.pause(),
            this.sequenceRoots(a.root),
            this.sequenceSets(a.sets),
          ]);
        } finally {
          span.end();
        }
      },
    );
  }

  /**
   * @dev
   * #1 BUG Zone.js bug causes context to be lost after `await
   * this.callbacks.playName`. The problem is the `await`. It even breaks with
   * `await Promise.resolve()`. The context is forced onto this call because of
   * that bug. If the bug is ever resolved, you won't need `context.with`.
   */
  private async sequenceRoot(p: ApplyRootParams) {
    return this.tracer.startActiveSpan(
      `${this.metadata.tag}:${this.metadata.action}:sequenceRoot`,
      async (span) => {
        try {
          span.addEvent("playName.start");
          const ctx = context.active();
          await this.callbacks.playName(p.apply);
          span.addEvent("playName.end & pause.start");
          await O11y.debug.pause();
          span.addEvent("pause.end & sequenceThen.start");
          await context.with(ctx, () => this.sequenceThen(p.then)); // #1
          span.addEvent("sequenceThen.end");
        } finally {
          span.end();
        }
      },
    );
  }

  private async sequenceRoots(
    roots: ApplyRootParams[] | undefined,
  ): Promise<void> {
    if (!roots) return Promise.resolve();
    return this.tracer.startActiveSpan(
      `${this.metadata.tag}:${this.metadata.action}:sequenceRoots`,
      async (span) => {
        try {
          await Promise.all(roots.map((p) => this.sequenceRoot(p)));
        } finally {
          span.end();
        }
      },
    );
  }

  private async sequenceSet({ props, then, wait }: LayoutSetsInform) {
    return this.tracer.startActiveSpan(
      `${this.metadata.tag}:${this.metadata.action}:sequenceSets`,
      async (span) => {
        try {
          const ctx = context.active();
          span.addEvent("delay.start");
          if (wait) await TimingUtils.delay(wait);
          span.addEvent("delay.end & pause.start");
          await O11y.debug.pause();
          span.addEvent("pause.end & informSet.start");
          await context.with(ctx, () => this.callbacks.informSet(props));
          span.addEvent("informSet.end");
          await O11y.debug.pause();
          span.addEvent("pause.end & sequenceThen.start");
          await this.sequenceThen(then);
          span.addEvent("sequenceThen.end");
        } finally {
          span.end();
        }
      },
    );
  }

  private async sequenceSets(l: LayoutParsedSets | undefined): Promise<void> {
    if (!l) return Promise.resolve();
    return this.tracer.startActiveSpan(
      `${this.metadata.tag}:${this.metadata.action}:sequenceSets`,
      async (span) => {
        try {
          await Promise.all(
            Object.values(l).map(async (v) => this.sequenceSet(v)),
          );
        } finally {
          span.end();
        }
      },
    );
  }

  private async sequenceThen(a: LayoutParsed | undefined): Promise<void> {
    if (!a) return Promise.resolve();
    return this.tracer.startActiveSpan(
      `${this.metadata.tag}:${this.metadata.action}:sequenceThen`,
      async (span) => {
        try {
          await this.sequenceCurrent(a);
          span.addEvent("sequence.current");
          await O11y.debug.pause();
          span.addEvent("debug.pause");
          await this.sequenceThen(a.then);
          span.addEvent("sequence.then");
        } finally {
          span.end();
        }
      },
    );
  }
}
