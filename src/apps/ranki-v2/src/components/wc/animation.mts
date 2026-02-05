import { assertNotExists } from "_error/assertions.mjs";
import type { Wc } from "./wc.mts";

interface WcAnimationConfig {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}
type WcAnimationEventNames = "enter" | "exit" | "reveal" | "collapse";
type WcAnimationEventRecord = Record<
  WcAnimationEventNames,
  () => WcAnimationConfig
>;

type WcDependency = HTMLElement | Wc<any>;
type WcDependencyCallback = () => WcDependency[];

const ANIMATION_PREFIX = "r-animation-";

export class WcAnimation extends EventTarget {
  private self: Wc<any>;
  public events: Partial<WcAnimationEventRecord> = {};
  private dependencyCb: WcDependencyCallback = () => [];
  private active: Record<string, Animation> = {};

  constructor(self: Wc<any>) {
    super();
    this.self = self;
  }

  private setActive(name: string, animation: Animation) {
    this.active[name] = animation;
  }

  private removeActive(name: string) {
    delete this.active[name];
  }

  listenEvent(
    name: string,
    configCb: (endState: Keyframe) => WcAnimationConfig,
  ) {
    this.dependencyCb().map((d) => {
      (d as Wc<any>).animation &&
        (d as Wc<any>).addEventListener(ANIMATION_PREFIX + name, (e) => {
          e.stopPropagation();
          const endState = (e as CustomEvent).detail.endState;
          this.runOnLayout(name, configCb, endState);
        });
    });
    return this;
  }

  private runOnLayout(
    name: string,
    intent: (endState: Keyframe) => WcAnimationConfig,
    endState: Keyframe,
  ) {
    this.animate(name, intent(endState));
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

  pushPreset(name: WcAnimationEventNames, config: () => WcAnimationConfig) {
    assertNotExists(this.events[name], {
      why: "Preset already defined",
      details: { name },
    });
    this.events[name] = config;
    return this;
  }

  setDependencyCallback(cb: WcDependencyCallback) {
    this.dependencyCb = cb;
    return this;
  }

  async runPreset(event: WcAnimationEventNames) {
    const animation = this.events[event];
    if (animation) {
      return this.animate(event, animation()).finished;
    }
    return Promise.resolve();
  }

  async triggerEvent(
    name: string,
    keyframe: () => Keyframe,
    frames: number = 2,
  ) {
    this.raf(frames, () => {
      this.dispatchAnimation(name, keyframe());
    });
  }

  private dispatchAnimation(name: string, endState: Keyframe) {
    this.self.dispatchEvent(
      new CustomEvent(ANIMATION_PREFIX + name, { detail: { endState } }),
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
