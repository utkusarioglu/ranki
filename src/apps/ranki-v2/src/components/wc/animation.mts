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

type AnimationCall = (endState: Keyframe) => WcAnimationConfig | void;

// type WcDependency = HTMLElement | Wc<any>;
// type WcDependencyCallback = () => WcDependency[];

const ANIMATION_PREFIX = "r-animation-";

interface EventPayload {
  type: string;
  payload: Keyframe;
}

// type EventCallback = (e: EventPayload) => void;

export class WcAnimation extends EventTarget {
  private self: Wc<any>;
  public presets: Partial<WcAnimationEventRecord> = {};
  private eventsCbs: Record<string, AnimationCall> = {};
  // private dependencyCb: WcDependencyCallback = () => [];
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

  registerEventCallback(name: string, cb: AnimationCall) {
    assertNotExists(this.eventsCbs[name], {
      why: "A callback has already been registered for this event",
      details: { name },
    });
    this.eventsCbs[name] = cb;
    return this;
  }

  pushDependency(eventName: string, dependency: Wc<any>) {
    dependency.addEventListener(ANIMATION_PREFIX, (e) => {
      e.stopPropagation();
      const detail: EventPayload = (e as CustomEvent).detail;
      if (detail.type === eventName) {
        const endState = detail.payload;
        const call = this.eventsCbs[eventName];
        this.runOnLayout(eventName, call, endState);
      }
    });
  }

  // listenEvent(
  //   name: string,
  //   configCb: (endState: Keyframe) => WcAnimationConfig | void,
  // ) {
  //   this.dependencyCb().map((d) => {
  //     (d as Wc<any>).animation &&
  //       (d as Wc<any>).addEventListener(ANIMATION_PREFIX, (e) => {
  //         e.stopPropagation();
  //         const detail = (e as CustomEvent).detail;
  //         if (detail.type === name) {
  //           const endState = detail.payload;
  //           this.runOnLayout(name, configCb, endState);
  //         }
  //       });
  //   });
  //   return this;
  // }

  private runOnLayout(
    name: string,
    configCb: AnimationCall,
    endState: Keyframe,
  ) {
    const config = configCb(endState);
    if (config) {
      this.animate(name, config);
      this.waitLayout().then(() =>
        this.dispatchAnimation(name, config.keyframes.at(-1)!),
      );
    }
  }

  animate(name: string, config: WcAnimationConfig) {
    const animation = this.self.animate(config.keyframes, config.options);
    this.setActive(name, animation);
    animation.finished.then(() => this.removeActive(name));
    return animation;
  }

  pushPreset(name: WcAnimationEventNames, config: () => WcAnimationConfig) {
    assertNotExists(this.presets[name], {
      why: "Preset already defined",
      details: { name },
    });
    this.presets[name] = config;
    return this;
  }

  // setDependencyCallback(cb: WcDependencyCallback) {
  //   this.dependencyCb = cb;
  //   return this;
  // }

  async runPreset(event: WcAnimationEventNames) {
    const animation = this.presets[event];
    if (animation) {
      return this.animate(event, animation()).finished;
    }
    return Promise.resolve();
  }

  async triggerEvent(
    name: string,
    cb: () => Keyframe | undefined,
    frames: number = 2,
  ) {
    this.raf(frames, () => {
      const config = cb();
      config && this.dispatchAnimation(name, config);
    });
  }

  private dispatchAnimation(type: string, payload: Keyframe) {
    this.self.dispatchEvent(
      new CustomEvent(ANIMATION_PREFIX, {
        detail: { type, payload },
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
