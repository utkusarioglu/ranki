import type { GeometryControllerInformSetCb } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

import type { AnimatorPlayCb } from "../animator.types.mjs";

export interface AnimationSequencerCallbacks {
  informSet: GeometryControllerInformSetCb;
  playName: AnimatorPlayCb;
}
