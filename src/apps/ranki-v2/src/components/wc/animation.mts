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
  private active: Record<string, Animation> = {};
  private onLayoutCbs: WcAnimationIntent[] = [];

  constructor(self: Wc<any>) {
    super();
    this.self = self;
  }

  private intentToConfig(intent: WcAnimationIntent): WcAnimationConfig {
    return {
      keyframes: intent.keyframes.map((k) =>
        Object.fromEntries(
          Object.entries(k).map(([n, v]) => [
            n,
            typeof v === "function" ? v() : v,
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

  getIntent(name: string) {
    if (name === "width") {
      console.log(
        "getIntent",
        this.self.tagName,
        name,
        (this.active[name]!.effect as KeyframeEffect).getKeyframes().at(-1)!
          .width,
      );
    }

    return (this.active[name]!.effect as KeyframeEffect).getKeyframes().at(-1)!;
  }

  async onLayout(name: string, intent: WcAnimationIntent) {
    await this.waitDependencies();
    const config = this.intentToConfig(intent);
    console.log(
      "onLayout",
      this.self.tagName,
      name,
      config.keyframes.at(-1)!.width,
    );
    this.animate(name, config);
  }

  animate(name: string, config: WcAnimationConfig) {
    const animation = this.self.animate(config.keyframes, config.options);
    this.setActive(name, animation);
    animation.finished.then(() => this.removeActive(name));
    this.waitLayout().then(() => this.dispatchLayout());
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
      return this.animate(event, animation).finished;
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
