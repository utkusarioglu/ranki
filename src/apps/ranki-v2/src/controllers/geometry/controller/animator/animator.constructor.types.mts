import type { LitElement } from "lit";
import type { GeometryControllerInformSetCb } from "../types/geometry-controller.types.mjs";
import type { AnimationDict } from "./animator.types.mjs";

export interface AnimatorCallbacks<Instance extends LitElement> {
  informSet: GeometryControllerInformSetCb;
  getCollection: GetCollectionConstructorParam<Instance>;
}

export type GetCollectionConstructorParam<Instance extends LitElement> =
  | ((s: Instance) => AnimationDict)
  | AnimationDict;
