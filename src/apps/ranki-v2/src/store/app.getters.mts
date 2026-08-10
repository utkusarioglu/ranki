import { assertNotUndefined } from "_error/assertions.mjs";
import { appStore } from "./app.mjs";
import type { GetAnimationRecipeProps } from "_controllers/geometry/controller/animator/animator.types.mjs";

export function getAnimationRecipe({
  action,
  preset: presetName,
  role: roleName,
}: GetAnimationRecipeProps) {
  // console.log(action, presetName, roleName);
  const collection = appStore.getState().state?.design.animationCollection;
  assertNotUndefined(collection, {
    why: "Animation collection does not exist",
  });
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
