import { assertNotExists, assertNotUndefined } from "_error/assertions.mjs";
import type { Wc } from "./wc.mts";
import type { WcWidthProps } from "./css.mts";
import { Timing } from "_utils/timing.mjs";

interface WcAnimationConfig {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}
type WcAnimationEventNames = "enter" | "exit" | "hide" | "show";
type WcAnimationEventRecord = Record<
  WcAnimationEventNames,
  () => WcAnimationConfig
>;

type AnimationCall = (payload: EventPayload) => WcAnimationConfig | void;

const ANIMATION_PREFIX = "r-animation";

interface EventPayload {
  keyframe: Keyframe | WcWidthProps;
  target: Wc<any>;
}

interface EventTransport {
  type: string;
  payload: EventPayload;
}

export class WcAnimation extends EventTarget {
  private self: Wc<any>;
  public presets: Partial<WcAnimationEventRecord> = {};
  private eventsCbs: Record<string, AnimationCall> = {};
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
      const detail: EventTransport = (e as CustomEvent).detail;
      if (detail.type === eventName) {
        const payload = detail.payload;
        const call = this.eventsCbs[eventName];
        this.runOnLayout(eventName, call, payload);
      }
    });
    return this;
  }

  private runOnLayout(
    name: string,
    configCb: AnimationCall,
    payload: EventPayload,
  ) {
    assertNotUndefined(configCb, {
      why: "No callback defined for animation dependency",
      details: { name, payload },
    });
    const config = configCb(payload);
    config && this.animate(name, config, true);
  }

  animate(name: string, config: WcAnimationConfig, emit: boolean = false) {
    const animation = this.self.animate(config.keyframes, config.options);
    this.setActive(name, animation);
    animation.finished.then(() => this.removeActive(name));
    emit &&
      Timing.waitLayout().then(() =>
        this.dispatchAnimation(name, {
          keyframe: config.keyframes.at(-1)!,
          target: this.self,
        }),
      );
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

  async runPreset(event: WcAnimationEventNames) {
    const animation = this.presets[event];
    if (animation) {
      return this.animate(event, animation()).finished;
    }
    return Promise.resolve();
  }

  async triggerEvent(
    name: string,
    cb: () => Keyframe | undefined | WcWidthProps,
    frames: number = 2,
  ) {
    Timing.raf(frames, () => {
      const config = cb();
      config &&
        this.dispatchAnimation(name, { keyframe: config, target: this.self });
    });
  }

  private dispatchAnimation(type: string, payload: EventPayload) {
    this.self.dispatchEvent(
      new CustomEvent(ANIMATION_PREFIX, {
        detail: { type, payload },
      }),
    );
  }
}
