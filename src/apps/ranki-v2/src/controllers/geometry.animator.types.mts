import type { Other } from "_components/r2c/r2c.mjs";
import type {
  Dims,
  InformContext,
  InformTargetStyles,
  Pos,
  UpdateStyle,
} from "./geometry.types.mts";
import type { GeometryController } from "./geometry.mts";
import type { Expression } from "expr-eval";

export type ImmediateStyles = { zIndex?: number } & AnimateableStyles;

export type AnimateableStyles = Partial<Dims> &
  Partial<Pos> &
  Partial<Anim> &
  Partial<Other> &
  Partial<{ offset: number }>;

export type AnimationOptions = Required<
  Pick<KeyframeAnimationOptions, "duration">
> &
  Partial<Pick<KeyframeAnimationOptions, "easing" | "delay">>;
export type AnimationCallback = (
  curr: UpdateStyle,
  prev: UpdateStyle | null,
  context: InformContext,
) => Promise<void>;

export type Anim = {
  easing: string;
};

export interface R2CWithGeometry {
  readonly geometry: GeometryController;
}

export type InformTargetCb = (params: InformTargetParams) => Promise<void>;

export type InformTargetParams = {
  target: string;
  // curr: InformTargetStyles;
  curr: UpdateStyle;
  prev: UpdateStyle | null;
  inform: AnimateableStylesConfigKeyframes;
  // changes: ReconciliationChanges;
};

export type AnimateableStylesConfigKeyframes = Partial<
  Record<keyof AnimateableStyles, string | number>
>;

interface AnimationRoot extends AnimationOptions {
  name: string;
  keyframes: AnimateableStylesConfigKeyframes[];
  // options: {
  delay?: number;
  duration: number;
  easing?: string;
  then?: AnimationBlock;
  // };
}

export interface AnimationBlock {
  root?: AnimationRoot[];
  targets?: Record<string, AnimationTarget>;
  then?: AnimationBlock;
}

export interface AnimationTarget {
  wait?: number;
  inform: AnimateableStylesConfigKeyframes;
  then?: AnimationBlock;
}

export type AnimationDict = Record<string, Record<string, AnimationBlock>>;
