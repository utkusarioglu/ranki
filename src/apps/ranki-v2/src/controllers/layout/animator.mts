import type { ReactiveElement } from "lit";
import type {
  LayoutActions,
  LayoutInformedChildStyle,
} from "./layout.types.mjs";
import {
  type InformSetTargetCallback,
  type ApplyParams,
  type AnimatorHooks,
} from "./animator.types.mjs";
import { getAnimationRecipe } from "_store/app.getters.mjs";
import type { LayoutRole } from "./layout.controller.types.mts";
import { AnimatorUtils } from "./animator.utils.mts";

export class Animator {
  private readonly host: ReactiveElement;
  private readonly role: LayoutRole;
  private readonly preset: string = "debug";
  private readonly informSetTarget: InformSetTargetCallback;
  private runningAnimations = new Map<string, Animation>();

  constructor(host: ReactiveElement, role: LayoutRole, hooks: AnimatorHooks) {
    this.host = host;
    this.role = role;
    this.informSetTarget = hooks.informSetTarget;
  }

  private async apply({
    name,
    keyframes,
    options,
  }: ApplyParams): Promise<void> {
    const finalOptions: KeyframeAnimationOptions = {
      // easing: "linear",
      easing: "ease-in-out",
      // easing: "cubic-bezier(0.6, -1, 0.2, 2.4)",
      fill: "both",
      ...options,
    };
    const finalKeyframes = keyframes.map((k) =>
      AnimatorUtils.produceKeyframe(k),
    );
    const anim = this.host.animate(finalKeyframes, finalOptions);
    const r = this.runningAnimations.get(name);
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
    this.runningAnimations.set(name, anim);
    await anim.finished;
  }

  public async updateStyle(
    actions: LayoutActions[],
    curr: LayoutInformedChildStyle,
    prev: LayoutInformedChildStyle | null,
    // context: InformContext,
  ): Promise<void> {
    await Promise.all(
      actions.map((action) => {
        const recipe = getAnimationRecipe(action, this.preset, this.role);
        return AnimatorUtils.decode({
          curr,
          prev,
          // context,
          block: recipe,
          apply: this.apply.bind(this),
          informTarget: this.informSetTarget.bind(this),
        });
      }),
    );
  }
}
