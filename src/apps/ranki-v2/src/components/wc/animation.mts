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

type WcDependency = HTMLElement | Wc<any>;
type WcDependencyCallback = () => WcDependency[];

export class WcAnimation extends EventTarget {
  private self: Wc<any>;
  public events: Partial<WcAnimationEventRecord> = {};
  private dependencyCb: WcDependencyCallback = () => [];

  constructor(self: Wc<any>) {
    super();
    this.self = self;
  }

  async onLayout(intent: WcAnimationIntent) {
    console.log("before");
    await this.waitDependencies();
    console.log("after");
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

  async animate({ keyframes, options }: WcAnimationConfig) {
    const animation = this.self.animate(keyframes, options);
    await this.waitLayout();
    this.dispatchLayout();
    return animation;
  }

  setEventLibrary(events: Partial<WcAnimationEventRecord> = {}) {
    this.events = events;
  }

  setDependencyCb(cb: WcDependencyCallback) {
    this.dependencyCb = cb;
  }

  async runEvent(event: WcAnimationEventNames) {
    const animation = this.events[event];
    if (animation) {
      return this.animate(animation).then((v) => v.finished);
    }
    return Promise.resolve();
  }

  dispatchLayout() {
    this.self.dispatchEvent(new Event("layout"));
  }

  async waitDependencies() {
    await Promise.all(
      this.dependencyCb().map((d) => {
        return (d as Wc<any>).animation
          ? new Promise<void>((r) =>
              (d as Wc<any>).addEventListener("layout", () => r(), {
                once: true,
              }),
            )
          : this.waitLayout();
      }),
    );
  }

  /**
   * Waits for layout to be available. as a heuristic, 2 frames work reliably.
   * This doesn't mean it cannot break.
   */
  async waitLayout() {
    await this.raf(2, () => {});
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
