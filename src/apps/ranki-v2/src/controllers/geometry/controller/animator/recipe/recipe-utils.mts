import { assertNotUndefined } from "_error/assertions.mjs";

import type { GeometryAnimationPresetDict } from "../types/library.types.mjs";
import type { GetAnimationRecipeProps } from "./recipe.types.mjs";
import { INTERACTION_SEPARATOR } from "../../sets/children/registry/children-registry.constants.mjs";
import type { AnimationBlock } from "../types/animator.types.mjs";

export class RecipeUtils {
  static getRecipeFromCollection(
    collection: GeometryAnimationPresetDict,
    { action, preset, role }: GetAnimationRecipeProps,
  ): AnimationBlock {
    if (action.endsWith("none")) return {};
    let curr = collection;
    const segments = [preset, role, ...action.split(INTERACTION_SEPARATOR)];

    segments.forEach((segment) => {
      curr = curr[segment];
      assertNotUndefined(curr, {
        why: "Given action path does not lead to an animation recipe",
        details: {
          curr,
          segments,
          action,
          presetName: preset,
          roleName: role,
          collection,
          segment,
        },
      });
    });

    return curr as AnimationBlock;
  }

  static getRecipeFromCollection_OLD(
    collection: GeometryAnimationPresetDict,
    {
      action,
      preset: presetName,
      role: roleName,
      // interaction,
    }: GetAnimationRecipeProps,
  ) {
    console.log("action big", [
      presetName,
      roleName,
      ...action.split(INTERACTION_SEPARATOR),
    ]);
    if (action === "lifecycle.none") return {};
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
    // @ts-expect-error TODO
    const recipe = roleDict[action];
    assertNotUndefined(recipe, {
      details: { action, role: roleName },
      why: "No recipe for this role exists",
    });
    return recipe;
  }
}
