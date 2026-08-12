import type { LocalAction } from "../events/types/geometry-events.types.mjs";
import type { GeometrySetName } from "../sets/sets.types.mjs";
import type {
  CurrentAppliedStyle,
  InformContext,
  InformedChildStyleContainer,
  InformedChildStyleSelf,
} from "../types/geometry-controller.types.mjs";
import type { TopLeft, WidthHeight } from "../types/geometry-style.types.mjs";
import type { GetAnimationRecipeProps } from "./recipe/recipe.types.mjs";

export type AnimatableStylesConfigKeyframes = Partial<
  Record<keyof AnimationKeyframeStyles, number | string>
>;

export interface AnimationBlock {
  root?: AnimationRoot[];
  sets?: AnimationBlockSets;
  then?: AnimationBlock;
}

export type AnimationBlockSets = Record<GeometrySetName, AnimationTarget>;

export type AnimationCallback = (
  curr: AnimationKeyframeStyles,
  prev: AnimationKeyframeStyles | null,
  context: InformContext,
) => Promise<void>;

export type AnimationDict = Record<
  // Preset name
  string,
  TargetAnimationSpec
>;

export type AnimationKeyframeOptions = {
  easing: string;
};

export type AnimationKeyframeStyles = Partial<{
  offset: number;
  opacity: number;
  rotate: number;
  scale: number;
  skewX: number;
  skewY: number;
  // rotate3d: string;
}> &
  Partial<AnimationKeyframeOptions> &
  Partial<TopLeft> &
  Partial<WidthHeight>;

export type AnimationOptions = Partial<
  Pick<KeyframeAnimationOptions, "delay" | "duration" | "easing">
>;

export interface AnimationRoot {
  delay?: number | string;
  duration: number | string;
  easing?: string;
  keyframes: AnimatableStylesConfigKeyframes[];
  name: string;
  then?: AnimationBlock;
}

// TODO
export interface AnimationTarget {
  expose?: AnimatableStylesConfigKeyframes;
  override?: AnimatableStylesConfigKeyframes;
  then?: AnimationBlock;
  wait?: number | string;
}

export type AnimatorPlayCb = (params: AnimatorPlayParams) => Promise<void>;

export interface AnimatorPlayParams {
  keyframes: AnimationKeyframeStyles[];
  name: string;
  options: AnimationOptions;
}

export interface ApplyRootParams {
  apply: AnimatorPlayParams;
  then?: LayoutParsed;
}

export type GetRecipeCallback = (p: GetAnimationRecipeProps) => AnimationBlock;

export interface InformSetProps {
  containerExposed: InformedChildStyleContainer;
  selfOverrides: InformedChildStyleSelf;
  setName: GeometrySetName;
}

export interface LayoutParsed {
  root?: ApplyRootParams[];
  sets?: LayoutParsedSets;
  then?: LayoutParsed;
}

export type LayoutParsedSets = Record<string, LayoutSetsInform>;

export type LayoutSetsInform = {
  props: InformSetProps;
  then?: LayoutParsed;
  wait?: number;
};

export interface ParseRootParams {
  curr: CurrentAppliedStyle;
  prev: CurrentAppliedStyle | null;
  recipe: AnimationBlock;
}
export type TargetAnimationSpec = Record<
  // component role
  string,
  Partial<Record<LocalAction, AnimationBlock>>
>;
