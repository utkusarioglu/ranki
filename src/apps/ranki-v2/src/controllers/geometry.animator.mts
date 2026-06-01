import type { ReactiveElement } from "lit";
import type {
  AnimationRole,
  InformContext,
  LocalAction,
  UpdateStyle,
} from "./geometry.types.mts";
import {
  type InformTargetCb,
  type ApplyParams,
  type AnimateableStyles,
  type AnimationBlock,
} from "./geometry.animator.types.mts";
import { TEMP_ANIMATION_DICT } from "./TEMP_ANIMATION_DICT.mts";
import { assertNotUndefined } from "_error/assertions.mjs";
import { AnimationUtils } from "./animator.utils.mts";

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
    const finalKeyframes = keyframes.map((k) => this.produceKeyframe(k));
    const anim = this.host.animate(finalKeyframes, finalOptions);
    const r = this.runningAnimations.get(name);
    if (r) {
      r.commitStyles();
      r.cancel();
    }
    this.runningAnimations.set(name, anim);
    await anim.finished;
  }

  private produceKeyframe({
    left,
    top,
    width,
    height,
    opacity,
    rotate,
    scale,
    offset,
    skewX,
    skewY,
    // rotate3d,
  }: AnimateableStyles): Keyframe {
    const k: Keyframe = {};
    const transform = [
      [left, `translateX(${left}px)`],
      [top, `translateY(${top}px)`],
      [skewX, `skewX(${skewX}deg)`],
      [skewY, `skewY(${skewY}deg)`],
      // [rotate3d, `rotate3d${(rotate3d || "").split(" ").join(", ")}deg`],
    ]
      .filter((v) => !!v[0])
      .map((v) => v[1]);

    if (transform.length) k.transform = transform.join(" ");
    if (width !== undefined) k.width = width + "px";
    if (height !== undefined) k.height = height + "px";
    if (rotate !== undefined) k.rotate = rotate + "deg";
    if (scale !== undefined) k.scale = scale;
    if (opacity !== undefined) k.opacity = opacity;
    if (offset !== undefined) k.offset = offset;

    return k;
  }

  public async updateStyle(
    curr: UpdateStyle,
    prev: UpdateStyle | null,
    context: InformContext,
  ): Promise<void> {
    const recipe = this.getRecipe(curr.main.action);
    return AnimationUtils.decode({
      curr,
      prev,
      context,
      block: recipe,
      apply: this.apply.bind(this),
      informTarget: this.informTarget.bind(this),
    });
  }

  private getRecipe(action: LocalAction): AnimationBlock {
    console.log(this.preset, this.role, action);
    if (action === "none") return {};
    const preset = TEMP_ANIMATION_DICT[this.preset];
    assertNotUndefined(preset, {
      why: "No such preset exists",
      details: { preset: this.preset },
    });
    const roleDict = preset[this.role];
    assertNotUndefined(roleDict, {
      why: "No animation for this role exists",
      details: { role: this.role, preset: this.preset },
    });
    const recipe = roleDict[action];
    assertNotUndefined(recipe, {
      why: "No recipe for this role exists",
      details: { role: this.role, action },
    });
    return recipe;
  }
}
