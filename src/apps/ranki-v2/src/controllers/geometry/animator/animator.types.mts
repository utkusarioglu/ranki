import type {
  InformContext,
  InformedChildStyle,
  UpdateStyle,
} from "../controller/geometry-controller.types.mts";
import type { LocalAction } from "../geometry-intent.types.mts";
import type { WidthHeight, TopLeft } from "../geometry-style.types.mjs";
import type { GeometrySetName } from "../controller/geometry-controller.types.mts";

export type AnimationKeyframeStyles = Partial<WidthHeight> &
  Partial<TopLeft> &
  Partial<AnimationKeyframeOptions> &
  Partial<{
    opacity: number;
    offset: number;
    rotate: number;
    scale: number;
    skewX: number;
    skewY: number;
    // rotate3d: string;
  }>;

export type AnimationOptions = Partial<
  Pick<KeyframeAnimationOptions, "easing" | "delay" | "duration">
>;

export type AnimationCallback = (
  curr: UpdateStyle,
  prev: UpdateStyle | null,
  context: InformContext,
) => Promise<void>;

export type AnimationKeyframeOptions = {
  easing: string;
};

export type InformTargetParams = {
  setName: GeometrySetName;
  curr: InformedChildStyle;
  prev: InformedChildStyle | null;
  inform: AnimatableStylesConfigKeyframes;
};

export type AnimatableStylesConfigKeyframes = Partial<
  Record<keyof AnimationKeyframeStyles, string | number>
>;

export interface AnimationRoot {
  name: string;
  keyframes: AnimatableStylesConfigKeyframes[];
  delay?: number | string;
  duration: number | string;
  easing?: string;
  then?: AnimationBlock;
}

export type AnimationBlockTargets = Record<string, AnimationTarget>;

export interface AnimationTarget {
  wait?: number | string;
  inform: AnimatableStylesConfigKeyframes;
  then?: AnimationBlock;
}

export type TargetAnimationSpec = Record<
  // component role
  string,
  Partial<Record<LocalAction, AnimationBlock>>
>;

export type AnimationDict = Record<
  // Preset name
  string,
  TargetAnimationSpec
>;

export interface AnimatorPlayParams {
  name: string;
  keyframes: AnimationKeyframeStyles[];
  options: AnimationOptions;
}

export interface ApplyRootParams {
  apply: AnimatorPlayParams;
  then?: LayoutParsed;
}

export type LayoutTargetsInform = {
  wait?: number;
  target: InformTargetParams;
  then?: LayoutParsed;
};

export type LayoutParsedTargets = Record<string, LayoutTargetsInform>;

export interface LayoutParsed {
  root?: ApplyRootParams[];
  targets?: LayoutParsedTargets;
  then?: LayoutParsed;
}

export type AnimatorPlayCb = (params: AnimatorPlayParams) => Promise<void>;

export interface AnimationBlock {
  root?: AnimationRoot[];
  targets?: AnimationBlockTargets;
  then?: AnimationBlock;
}
export interface ParseRootParams {
  curr: InformedChildStyle;
  prev: InformedChildStyle | null;
  block: AnimationBlock;
}
