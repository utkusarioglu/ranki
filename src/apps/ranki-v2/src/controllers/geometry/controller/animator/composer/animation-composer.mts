import type { LocalAction } from "_controllers/geometry/geometry-intent.types.mjs";

import { getAnimationRecipe } from "_store/app.getters.mjs";

import type { CurrentAppliedStyle } from "../../types/geometry-controller.types.mjs";

import { LayoutParser } from "../parser/layout-parser.mjs";

interface AnimationCompose {
  action: LocalAction;
  curr: CurrentAppliedStyle;
  preset: string;
  prev: CurrentAppliedStyle | null;
  role: string;
}
export class AnimationComposer {
  public static compose({
    action,
    curr,
    preset,
    prev,
    role,
  }: AnimationCompose) {
    const block = getAnimationRecipe(action, preset, role);
    return LayoutParser.parse({ block, curr, prev });
  }
}
