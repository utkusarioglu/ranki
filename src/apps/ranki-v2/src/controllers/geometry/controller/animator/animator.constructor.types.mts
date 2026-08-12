import type { LitElement } from "lit";

import type { GeometryControllerInformSetCb } from "../types/geometry-controller.types.mjs";
import type { AnimationDict } from "./animator.types.mjs";

export interface AnimatorCallbacks<Instance extends LitElement> {
  getCollection: GetCollectionConstructorParam<Instance>;
  informSet: GeometryControllerInformSetCb;
}

export type GetCollectionConstructorParam<Instance extends LitElement> =
  | ((s: Instance) => AnimationDict)
  | AnimationDict;
