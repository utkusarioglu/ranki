import type { AnimatorPlayCb } from "../animator.types.mts";
import type { GeometryControllerInformTargetCb } from "_controllers/geometry/controller/geometry-controller.types.mjs";

export interface AnimationSequencerCallbacks {
  playName: AnimatorPlayCb;
  informTarget: GeometryControllerInformTargetCb;
}
