import type { LocalAction } from "_controllers/geometry/geometry-intent.types.mjs";
import { getAnimationRecipe } from "_store/app.getters.mjs";
import type { CurrentAppliedStyle } from "../../types/geometry-controller.types.mts";
import { LayoutParser } from "../parser/layout-parser.mts";

interface AnimationCompose {
  preset: string;
  role: string;
  action: LocalAction;
  curr: CurrentAppliedStyle;
  prev: CurrentAppliedStyle | null;
}
export class AnimationComposer {
  public static compose({
    preset,
    role,
    action,
    curr,
    prev,
  }: AnimationCompose) {
    const block = getAnimationRecipe(action, preset, role);
    return LayoutParser.parse({ block, curr, prev });
  }
}
