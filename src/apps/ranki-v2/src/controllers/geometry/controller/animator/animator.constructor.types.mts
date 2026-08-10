import type { GeometryControllerInformSetCb } from "../types/geometry-controller.types.mjs";
import type { GetRecipeCallback } from "./animator.types.mjs";

export interface AnimatorCallbacks {
  informSet: GeometryControllerInformSetCb;
  getRecipe: GetRecipeCallback;
}
