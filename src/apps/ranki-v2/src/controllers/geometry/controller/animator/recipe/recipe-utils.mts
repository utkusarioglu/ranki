import { assertNotUndefined } from "_error/assertions.mjs";
import type { AnimationDict } from "../animator.types.mjs";
import type { GetAnimationRecipeProps } from "./recipe.types.mjs";

export class RecipeUtils {
  static getRecipeFromCollection(
    collection: AnimationDict,
    {
      action,
      preset: presetName,
      role: roleName,
      // interaction,
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
