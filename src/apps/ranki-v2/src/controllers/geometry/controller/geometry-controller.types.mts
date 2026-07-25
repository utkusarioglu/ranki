import type { InformTargetParams } from "../animator/animator.types.mts";

export type GeometrySetName = string & { type?: "GeometrySet" };

export interface OnEmitParams {
  set: GeometrySetName;
}
export type GeometryControllerInformTargetCb = (
  params: InformTargetParams,
) => Promise<void>;
