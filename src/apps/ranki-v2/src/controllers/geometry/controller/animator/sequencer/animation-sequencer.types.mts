import type { AnimatorPlayCb } from "../animator.types.mts";
import type { GeometryControllerInformSetCb } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

export interface AnimationSequencerCallbacks {
  playName: AnimatorPlayCb;
  informSet: GeometryControllerInformSetCb;
}
