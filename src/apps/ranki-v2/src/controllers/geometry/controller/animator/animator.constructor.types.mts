import type { LitElement } from "lit";
import type { GeometryControllerInformSetCb } from "../types/geometry-controller.types.mjs";
import type {
  AnimationBlock,
  AnimationDict,
  GetAnimationRecipeProps,
} from "./animator.types.mjs";

export interface AnimatorCallbacks<Instance extends LitElement> {
  informSet: GeometryControllerInformSetCb;
  getRecipe: GetRecipeConstructorParam<Instance>;
}

export type GetRecipeConstructorParam<Instance extends LitElement> =
  | ((s: Instance, p: GetAnimationRecipeProps) => AnimationBlock)
  | AnimationDict;
