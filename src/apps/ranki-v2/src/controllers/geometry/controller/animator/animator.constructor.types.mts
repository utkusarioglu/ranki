import type { LitElement } from "lit";

import type { GeometryControllerInformSetCb } from "../types/geometry-controller.types.mjs";
import type { GeometryAnimationPresetDict } from "./library.types.mjs";

export interface AnimatorCallbacks<Instance extends LitElement> {
  getCollection: GetCollectionConstructorParam<Instance>;
  informSet: GeometryControllerInformSetCb;
}

export type GetCollectionConstructorParam<Instance extends LitElement> =
  | ((s: Instance) => GeometryAnimationPresetDict)
  | GeometryAnimationPresetDict;
