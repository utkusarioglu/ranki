import type { AnimationKeyframeStyles } from "./animator/animator.types.mjs";
import type { WidthHeight } from "./geometry-style.types.mjs";
import type {
  WithEmitIntent,
  WithMode,
  WithEmitIntents,
} from "./geometry-intent.types.mjs";

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
