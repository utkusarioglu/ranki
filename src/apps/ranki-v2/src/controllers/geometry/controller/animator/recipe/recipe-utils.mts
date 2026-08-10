import { assertNotUndefined } from "_error/assertions.mjs";
import type {
  AnimationDict,
  GetAnimationRecipeProps,
} from "../animator.types.mjs";

export class RecipeUtils {
  static getRecipeFromCollection(
    collection: AnimationDict,
    {
      action,
      preset: presetName,
      role: roleName,
      // mode,
    }: GetAnimationRecipeProps,
  ) {
    if (action === "none") return {};
    const preset = collection[presetName];
    assertNotUndefined(preset, {
      why: "No such preset exists",
      details: { preset: presetName },
    });
    const roleDict = preset[roleName];
    assertNotUndefined(roleDict, {
      why: "No animation for this role exists",
      details: { role: roleName, preset: presetName },
    });
    const recipe = roleDict[action];
    assertNotUndefined(recipe, {
      why: "No recipe for this role exists",
      details: { role: roleName, action },
    });
    return recipe;
  }
}
