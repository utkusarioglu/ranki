import type { R2C } from "_components/r2c/r2c.mjs";
import type { AnimationKeyframeStyles } from "./animator/animator.types.mjs";
import type { LitElement } from "lit";
import type { WidthHeight } from "./geometry-style.types.mjs";
import type {
  WithEmitIntent,
  WithMode,
  WithEmitIntents,
} from "./geometry-intent.types.mjs";

export type HostType = LitElement;

export type TypedDims = WidthHeight & WithEmitIntent & WithMode;

export interface ComponentDims {
  component: R2C;
  dims: TypedDims;
}

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
