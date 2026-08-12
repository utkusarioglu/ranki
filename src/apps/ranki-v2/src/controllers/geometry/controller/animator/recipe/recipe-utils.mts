import { assertNotUndefined } from "_error/assertions.mjs";

import type { GeometryAnimationPresetDict } from "../library.types.mjs";
import type { GetAnimationRecipeProps } from "./recipe.types.mjs";

export class RecipeUtils {
  static getRecipeFromCollection(
    collection: GeometryAnimationPresetDict,
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
      details: { preset: presetName },
      why: "No such preset exists",
    });
    const roleDict = preset[roleName];
    assertNotUndefined(roleDict, {
      details: { preset: presetName, role: roleName },
      why: "No animation for this role exists",
    });
    const recipe = roleDict[action];
    assertNotUndefined(recipe, {
      details: { action, role: roleName },
      why: "No recipe for this role exists",
    });
    return recipe;
  }
}
