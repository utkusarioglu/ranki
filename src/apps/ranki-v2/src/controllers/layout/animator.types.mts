import type {
  LayoutActions,
  LayoutInformedChildStyle,
} from "./layout.types.mts";
import type { AnimatableStylesPartial } from "./style/style.types.mts";

export type ImmediateStyles = { zIndex?: number } & AnimatableStylesPartial;

export interface AnimatorHooks {
  informSetTarget: InformSetTargetCallback;
}

export type AnimationOptions = Partial<
  Pick<KeyframeAnimationOptions, "easing" | "delay" | "duration">
>;
export type AnimationCallback = (
  curr: UpdateStyle,
  prev: UpdateStyle | null,
  context: InformContext,
) => Promise<void>;

export type Anim = {
  easing: string;
};

// export interface R2CWithGeometry {
//   readonly geometry: GeometryController;
// }

export type InformSetTargetCallback = (
  params: InformSetTargetCallbackParams,
) => Promise<void>;

export type InformSetTargetCallbackParams = {
  id: string;
  curr: LayoutInformedChildStyle;
  prev: LayoutInformedChildStyle | null;
  inform: AnimateableStylesConfigKeyframes;
};

export type AnimateableStylesConfigKeyframes = Partial<
  Record<keyof AnimatableStylesPartial, string | number>
>;

export interface AnimationRoot {
  name: string;
  keyframes: AnimateableStylesConfigKeyframes[];
  delay?: number | string;
  duration: number | string;
  easing?: string;
  then?: AnimationBlock;
}

export interface AnimationBlock {
  root?: AnimationRoot[];
  targets?: Record<string, AnimationTarget>;
  then?: AnimationBlock;
}

export interface AnimationTarget {
  wait?: number | string;
  inform: AnimateableStylesConfigKeyframes;
  then?: AnimationBlock;
}

export type TargetAnimationSpec = Record<
  // component role
  string,
  Partial<Record<LayoutActions, AnimationBlock>>
>;

export type AnimationDict = Record<
  // Preset name
  string,
  TargetAnimationSpec
>;

export interface DecodeParams {
  curr: LayoutInformedChildStyle;
  prev: LayoutInformedChildStyle | null;
  // context: InformContext;
  block: AnimationBlock;
  apply(p: ApplyParams): Promise<void>;
  informTarget: InformSetTargetCallback;
}

export interface ApplyParams {
  name: string;
  keyframes: AnimatableStylesPartial[];
  options: AnimationOptions;
}
