import type { AnimatableStylesPartial } from "../style/style.types.mts";
import type { LayoutInformedChildStyle } from "../layout.types.mts";

export interface DecodeParams {
  curr: LayoutInformedChildStyle;
  prev: LayoutInformedChildStyle | null;
  // context: InformContext;
  block: AnimationBlock;
  // apply(p: ApplyParams): Promise<void>;
  // informTarget: InformSetTargetCallback;
}

export interface AnimationBlock {
  root?: AnimationRoot[];
  targets?: Record<string, AnimationTarget>;
  then?: AnimationBlock;
}

export interface AnimationRoot {
  name: string;
  keyframes: AnimateableStylesConfigKeyframes[];
  delay?: number | string;
  duration: number | string;
  easing?: string;
  then?: AnimationBlock;
}

export type AnimateableStylesConfigKeyframes = Partial<
  Record<keyof AnimatableStylesPartial, string | number>
>;

export interface AnimationTarget {
  wait?: number | string;
  inform: AnimateableStylesConfigKeyframes;
  then?: AnimationBlock;
}

export interface AnimationApplyParams {
  name: string;
  keyframes: AnimatableStylesPartial[];
  options: AnimationOptions;
  then?: AnimationApplyParams[];
}

export type AnimationOptions = Partial<
  Pick<KeyframeAnimationOptions, "easing" | "delay" | "duration">
>;
