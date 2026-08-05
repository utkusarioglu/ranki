import type {
  CurrentAppliedStyle,
  InformContext,
  InformedChildStyleContainer,
  InformedChildStyleSelf,
} from "../types/geometry-controller.types.mjs";
import type {
  LocalAction,
  WithEmitIntents,
} from "../../geometry-intent.types.mjs";
import type { WidthHeight, TopLeft } from "../../geometry-style.types.mjs";
import type { GeometrySetName } from "../sets/sets.types.mjs";

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

export type AnimationBlockSets = Record<GeometrySetName, AnimationTarget>;

// TODO
export interface AnimationTarget {
  wait?: number | string;
  expose?: AnimatableStylesConfigKeyframes;
  override?: AnimatableStylesConfigKeyframes;
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

export interface InformSetProps {
  setName: GeometrySetName;
  containerExposed: InformedChildStyleContainer;
  selfOverrides: InformedChildStyleSelf;
}

export type LayoutSetsInform = {
  wait?: number;
  props: InformSetProps;
  then?: LayoutParsed;
};

export type LayoutParsedSets = Record<string, LayoutSetsInform>;

export interface LayoutParsed {
  root?: ApplyRootParams[];
  sets?: LayoutParsedSets;
  then?: LayoutParsed;
}

export type AnimatorPlayCb = (params: AnimatorPlayParams) => Promise<void>;

export interface AnimationBlock {
  root?: AnimationRoot[];
  sets?: AnimationBlockSets;
  then?: AnimationBlock;
}

export interface ParseRootParams {
  curr: CurrentAppliedStyle;
  prev: CurrentAppliedStyle | null;
  block: AnimationBlock;
}
export type UpdateStyle = AnimationKeyframeStyles & WithEmitIntents;
