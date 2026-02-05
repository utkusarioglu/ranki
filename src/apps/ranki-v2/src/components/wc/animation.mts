import { assertNotNull } from "_error/assertions.mjs";
import type { Wc } from "./wc.mts";

type KeyframeResolver<T> = T | (() => T);

type KeyframeWithResolvers = {
  [K in keyof Keyframe]?: KeyframeResolver<Keyframe[K]>;
};

interface WcAnimationIntent {
  keyframes: KeyframeWithResolvers[];
  options: KeyframeAnimationOptions;
}

interface WcAnimationConfig {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}
type WcAnimationEventNames = "enter" | "exit" | "reveal" | "collapse";
type WcAnimationEventRecord = Record<WcAnimationEventNames, WcAnimationConfig>;

type WcDependencyCallback = () => Wc<any>[];

export class WcAnimation {
  private self: Wc<any>;
  public events: Partial<WcAnimationEventRecord> = {};
  private depCb: WcDependencyCallback | null = null;
  public layoutReady = false;

  constructor(self: Wc<any>) {
    this.self = self;
  }

  async onLayout(intent: WcAnimationIntent) {
    await this.waitLayout();
    this.animate({
      keyframes: intent.keyframes.map((k) =>
        Object.fromEntries(
          Object.entries(k).map(([n, v]) => [
            n,
            typeof v === "function" ? v() : v,
          ]),
        ),
      ),
      options: intent.options,
    });
  }

  animate({ keyframes, options }: WcAnimationConfig) {
    return this.self.animate(keyframes, options);
  }

  setEventLibrary(events: Partial<WcAnimationEventRecord> = {}) {
    this.events = events;
  }

  setDependencyCb(cb: () => Wc<any>[]) {
    this.depCb = cb;
  }

  // TODO
  adjustWidth() {
    assertNotNull(this.depCb, { why: "Access to dependencies required" });
  }

  runEvent(event: WcAnimationEventNames) {
    const animation = this.events[event];
    if (animation) {
      return this.animate(animation).finished;
    }
    return Promise.resolve();
  }

  /**
   * Waits for layout to be available
   */
  waitLayout() {
    return this.raf(2, () => {});
  }

  raf(frames: number = 2, cb: () => void): Promise<void> {
    function step(resolve: () => void, cb: () => void) {
      if (--frames <= 0) {
        cb();
        resolve();
      } else {
        requestAnimationFrame(() => step(resolve, cb));
      }
    }
    return new Promise<void>((r) => step(r, cb));
  }
}
