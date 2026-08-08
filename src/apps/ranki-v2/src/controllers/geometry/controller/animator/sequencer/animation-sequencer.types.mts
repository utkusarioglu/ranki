import type { GeometryControllerInformSetCb as GeometryControllerInformSetCallback } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

import type { AnimatorPlayCb } from "../animator.types.mjs";

export interface AnimationSequencerCallbacks {
  informSet: GeometryControllerInformSetCallback;
  playName: AnimatorPlayCb;
}
