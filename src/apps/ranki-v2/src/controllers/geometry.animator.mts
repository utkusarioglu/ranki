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
} from "./geometry.animator.types.mts";
import { TEMP_ANIMATION_DICT } from "./TEMP_ANIMATION_DICT.mts";
import { assertNotUndefined } from "_error/assertions.mjs";
import { AnimationUtils } from "./animator.utils.mts";

export class Animator {
  private readonly host: ReactiveElement;
  private readonly role: AnimationRole;
  private readonly preset: string = "default";
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

  private async apply({ name, pos, options }: ApplyParams): Promise<void> {
    let transform = {};
    const hasLeft = pos.left !== undefined;
    const hasTop = pos.top !== undefined;
    if (hasLeft || hasTop) {
      const maybe = [
        hasLeft ? "translateX(" + pos.left + "px)" : undefined,
        hasTop ? "translateY(" + pos.top + "px)" : undefined,
      ]
        .filter((v) => !!v)
        .join(" ");
      if (maybe.length) {
        transform = { transform: maybe };
      }
    }
    const anim = this.host.animate(
      {
        ...transform,
        ...(pos.width !== undefined ? { width: pos.width + "px" } : {}),
        ...(pos.height !== undefined ? { height: pos.height + "px" } : {}),
        ...(pos.opacity !== undefined ? { opacity: pos.opacity } : {}),
      },
      {
        // easing: "linear",
        // easing: "ease-in-out",
        easing: "cubic-bezier(0.6, -1, 0.2, 2.4)",
        fill: "both",
        ...options,
      },
    );
    const r = this.runningAnimations.get(name);
    r?.commitStyles();
    r?.cancel();
    this.runningAnimations.set(name, anim);
    await anim.finished;
    return;
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

  private getRecipe(action: LocalAction) {
    if (action === "none") return {};
    const roleDict = TEMP_ANIMATION_DICT["default"][this.role];
    assertNotUndefined(roleDict, {
      why: "No animation for this role exists",
      details: { role: this.role },
    });
    const recipe = roleDict[action];
    assertNotUndefined(recipe, {
      why: "No recipe for this role exists",
      details: { role: this.role, action },
    });
    return recipe;
  }
}
