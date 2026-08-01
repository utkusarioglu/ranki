import type { LitElement } from "lit";
import { type AnimatorPlayParams } from "./animator.types.mjs";
import { type AnimatorCallbacks } from "./animator.constructor.types.mjs";
import { AnimationSequencer } from "./sequencer/animation-sequencer.mjs";
import type { GeometryRole } from "../types/geometry-controller.constructor.types.mjs";
import { KeyframeUtils } from "./keyframe/keyframe-utils.mjs";
import type { CurrentAppliedStyle } from "../types/geometry-controller.types.mjs";
import { DebugUtils } from "_/debug/debug-utils.mjs";
import { AnimationComposer } from "./composer/animation-composer.mts";

export class Animator {
  private readonly host: LitElement;
  private readonly role: GeometryRole;
  private readonly sequencer: AnimationSequencer;
  private readonly callbacks: AnimatorCallbacks;
  private readonly preset: string = "debug";
  private running = new Map<string, Animation>();

  constructor(
    host: LitElement,
    role: GeometryRole,
    callbacks: AnimatorCallbacks,
  ) {
    this.host = host;
    this.role = role;
    this.callbacks = callbacks;
    this.sequencer = new AnimationSequencer({
      informTarget: this.callbacks.informSet.bind(this),
      playName: this.playName.bind(this),
    });
  }

  private async playName({
    name,
    keyframes,
    options,
  }: AnimatorPlayParams): Promise<void> {
    const finalOptions: KeyframeAnimationOptions = {
      // easing: "linear",
      easing: "ease-in-out",
      // easing: "cubic-bezier(0.6, -1, 0.2, 2.4)",
      fill: "both",
      ...options,
    };
    const finalKeyframes = keyframes.map((k) =>
      KeyframeUtils.produceKeyframe(k),
    );
    const anim = this.host.animate(finalKeyframes, finalOptions);
    const r = this.running.get(name);
    if (r) {
      r.oncancel = (_ev) => {
        if (r.playState === "running") {
          console.warn(
            "Animation cancelled while running.",
            "Name: ",
            name,
            "tag: ",
            this.host.tagName,
          );
        }
      };
      r.commitStyles();
      r.cancel();
    }
    this.running.set(name, anim);
    await anim.finished;
  }

  public async update(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
  ): Promise<void> {
    DebugUtils.animatorUpdate({ host: this.host, curr, prev });
    await Promise.all(
      curr.actions.map((action) => {
        const composed = AnimationComposer.compose({
          preset: this.preset,
          role: this.role,
          action,
          curr,
          prev,
        });
        return this.sequencer.build(composed);
      }),
    );
  }
}
