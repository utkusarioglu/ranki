import type { Wc } from "./wc.mts";

type KeyframeResolver<T> = T | ((endState: Keyframe) => T);

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
  private active: Record<string, Animation> = {};

  constructor(self: Wc<any>) {
    super();
    this.self = self;
  }

  private intentToConfig(
    intent: WcAnimationIntent,
    endState: Keyframe,
  ): WcAnimationConfig {
    return {
      keyframes: intent.keyframes.map((k) =>
        Object.fromEntries(
          Object.entries(k).map(([n, v]) => [
            n,
            typeof v === "function" ? v(endState) : v,
          ]),
        ),
      ),
      options: intent.options,
    };
  }

  private setActive(name: string, animation: Animation) {
    this.active[name] = animation;
  }

  private removeActive(name: string) {
    delete this.active[name];
  }

  onLayout(name: string, intent: WcAnimationIntent) {
    this.dependencyCb().map((d) => {
      (d as Wc<any>).animation &&
        (d as Wc<any>).addEventListener(`animation-${name}`, (e) => {
          e.stopPropagation();
          const endState = (e as CustomEvent).detail.endState;
          this.runOnLayout(name, intent, endState);
        });
    });
    return this;
  }

  private runOnLayout(
    name: string,
    intent: WcAnimationIntent,
    endState: Keyframe,
  ) {
    const config = this.intentToConfig(intent, endState);
    this.animate(name, config);
  }

  animate(name: string, config: WcAnimationConfig) {
    const animation = this.self.animate(config.keyframes, config.options);
    this.setActive(name, animation);
    animation.finished.then(() => this.removeActive(name));
    this.waitLayout().then(() =>
      this.dispatchAnimation(name, config.keyframes.at(-1)!),
    );
    return animation;
  }

  setEventLibrary(events: Partial<WcAnimationEventRecord> = {}) {
    this.events = events;
    return this;
  }

  setDependencyCb(cb: WcDependencyCallback) {
    this.dependencyCb = cb;
    return this;
  }

  async runEvent(event: WcAnimationEventNames) {
    const animation = this.events[event];
    if (animation) {
      return this.animate(event, animation).finished;
    }
    return Promise.resolve();
  }

  async trigger(name: string, keyframe: () => Keyframe) {
    this.raf(2, () => {
      this.dispatchAnimation(name, keyframe());
    });
  }

  dispatchAnimation(name: string, endState: Keyframe) {
    this.self.dispatchEvent(
      new CustomEvent(`animation-${name}`, { detail: { endState } }),
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
