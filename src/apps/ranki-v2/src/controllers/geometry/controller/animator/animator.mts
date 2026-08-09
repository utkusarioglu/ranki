import type { LitElement } from "lit";

import { DebugUtils } from "_/debug/debug-utils.mjs";

import type { GeometryRole } from "../types/geometry-controller.constructor.types.mjs";
import type { CurrentAppliedStyle } from "../types/geometry-controller.types.mjs";

import { type AnimatorCallbacks } from "./animator.constructor.types.mjs";
import { type AnimatorPlayParams } from "./animator.types.mjs";
import { AnimationComposer } from "./composer/animation-composer.mjs";
import { KeyframeUtils } from "./keyframe/keyframe-utils.mjs";
import { AnimationSequencer } from "./sequencer/animation-sequencer.mjs";

export class Animator {
  private readonly callbacks: AnimatorCallbacks;
  private readonly host: LitElement;
  private readonly preset: string = "debug";
  private readonly role: GeometryRole;
  private running = new Map<string, Animation>();
  private readonly sequencer: AnimationSequencer;

  constructor(
    host: LitElement,
    role: GeometryRole,
    callbacks: AnimatorCallbacks,
  ) {
    this.host = host;
    this.role = role;
    this.callbacks = callbacks;
    this.sequencer = new AnimationSequencer({
      informSet: this.callbacks.informSet,
      playName: this.playName.bind(this),
    });
  }

  public async update(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
  ): Promise<void> {
    DebugUtils.animatorUpdate({ curr, host: this.host, prev });
    await Promise.all(
      curr.actions.map((action) => {
        const composed = AnimationComposer.compose({
          action,
          curr,
          preset: this.preset,
          prev,
          role: this.role,
        });
        DebugUtils.animatorUpdateComposed({ host: this.host, composed });
        return this.sequencer.build(composed);
      }),
    );
  }

  private async playName({
    keyframes,
    name,
    options,
  }: AnimatorPlayParams): Promise<void> {
    const finalOptions: KeyframeAnimationOptions = {
      ...KeyframeUtils.OPTIONS_DEFAULTS,
      // easing: "linear",
      // easing: "ease-in-out",
      // easing: "cubic-bezier(0.6, -1, 0.2, 2.4)",
      // fill: "both",
      ...options,
    };
    const finalKeyframes = KeyframeUtils.produceKeyframes(keyframes);
    DebugUtils.animatorPlayName({
      host: this.host,
      finalOptions,
      finalKeyframes,
    });
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
    await anim.finished
      .then(() => this.running.delete(name))
      .catch((e) =>
        console.log("ABORT", {
          host: this.host,
          running: this.running,
          e,
          new: {
            name,
            keyframes,
            options,
          },
        }),
      );
  }
}
