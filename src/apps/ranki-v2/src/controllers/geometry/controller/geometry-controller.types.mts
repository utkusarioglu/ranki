import type {
  AnimationKeyframeStyles,
  InformTargetParams,
} from "../animator/animator.types.mts";
import type {
  WithEmitIntent,
  WithEmitIntents,
  WithMode,
} from "../geometry-intent.types.mts";
import type { WidthHeight } from "../geometry-style.types.mts";

export type GeometrySetName = string & { type?: "GeometrySet" };

export interface OnEmitParams {
  set: GeometrySetName;
}

export type GeometryControllerInformTargetCb = (
  params: InformTargetParams,
) => Promise<void>;

export type ComponentDims = WidthHeight & WithEmitIntent & WithMode;

export type InformedChildStyle = AnimationKeyframeStyles &
  WithEmitIntent &
  WithEmitIntents &
  Partial<WithMode>;

export type UpdateStyle = AnimationKeyframeStyles & WithEmitIntents;

export type InformContext = {
  index: number;
  length: number;
  stagger: number[];
};
