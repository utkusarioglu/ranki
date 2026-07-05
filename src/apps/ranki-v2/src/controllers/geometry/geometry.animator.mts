import type { ReactiveElement } from "lit";
import type {
  AnimationRole,
  InformContext,
  LocalAction,
  UpdateStyle,
} from "./geometry.types.mjs";
import {
  type InformTargetCb,
  type ApplyParams,
} from "./geometry.animator.types.mjs";
import { AnimatorUtils } from "../../utils/animator.utils.mjs";
import { getAnimationRecipe } from "_store/app.getters.mjs";

export class Animator {
  private readonly host: ReactiveElement;
  private readonly role: AnimationRole;
  private readonly preset: string = "debug";
  private readonly informTarget: InformTargetCb;
  private runningAnimations = new Map<string, Animation>();

  constructor(
    host: ReactiveElement,
    role: AnimationRole,
    informTarget: InformTargetCb,
  ) {
    this.host = host;
    this.role = role;
    this.informTarget = informTarget;
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
      r.oncancel = (ev) => {
        // console.log("cancel", name, this.host.tagName);
      };
      r.commitStyles();
      r.cancel();
    }
    this.runningAnimations.set(name, anim);
    await anim.finished;
  }

  public async updateStyle(
    actions: LocalAction[],
    curr: UpdateStyle,
    prev: UpdateStyle | null,
    context: InformContext,
  ): Promise<void> {
    await Promise.all(
      actions.map((action) => {
        const recipe = getAnimationRecipe(action, this.preset, this.role);
        return AnimatorUtils.decode({
          curr,
          prev,
          context,
          block: recipe,
          apply: this.apply.bind(this),
          informTarget: this.informTarget.bind(this),
        });
      }),
    );
  }
}
