import type { Other } from "_components/r2c/r2c.mjs";
import type {
  Dims,
  InformContext,
  InformedChildStyle,
  LocalAction,
  Pos,
  UpdateStyle,
} from "../geometry.types.mjs";

export type ImmediateStyles = { zIndex?: number } & AnimateableStyles;

export type AnimateableStyles = Partial<Dims> &
  Partial<Pos> &
  Partial<Anim> &
  Partial<Other> &
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

export type Anim = {
  easing: string;
};

export interface AnimatorCallbacks {
  informTarget: InformTargetCb;
}

// export interface R2CWithGeometry {
//   readonly geometry: GeometryController;
// }

export type InformTargetCb = (params: InformTargetParams) => Promise<void>;

export type ApplyCb = (params: ApplyParams) => Promise<void>;

export interface AnimationSequencerCallbacks {
  animate: ApplyCb;
  informTarget: InformTargetCb;
}

export type InformTargetParams = {
  id: string;
  curr: InformedChildStyle;
  prev: InformedChildStyle | null;
  inform: AnimateableStylesConfigKeyframes;
};

export type AnimateableStylesConfigKeyframes = Partial<
  Record<keyof AnimateableStyles, string | number>
>;

export interface AnimationRoot {
  name: string;
  keyframes: AnimateableStylesConfigKeyframes[];
  delay?: number | string;
  duration: number | string;
  easing?: string;
  then?: AnimationBlock;
}

export type AnimationBlockTargets = Record<string, AnimationTarget>;

export interface AnimationBlock {
  root?: AnimationRoot[];
  targets?: AnimationBlockTargets;
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
  Partial<Record<LocalAction, AnimationBlock>>
>;

export type AnimationDict = Record<
  // Preset name
  string,
  TargetAnimationSpec
>;

// OBSOLETE in favor of ParseRootParams
export interface DecodeParams {
  curr: InformedChildStyle;
  prev: InformedChildStyle | null;
  context: InformContext;
  block: AnimationBlock;
  apply(p: ApplyParams): Promise<void>;
  informTarget: InformTargetCb;
}

export interface ApplyParams {
  name: string;
  keyframes: AnimateableStyles[];
  options: AnimationOptions;
}

export interface ApplyRootParams {
  apply: ApplyParams;
  // TODO needs to change
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

export interface ParseRootParams {
  curr: InformedChildStyle;
  prev: InformedChildStyle | null;
  context: InformContext;
  block: AnimationBlock;
  // apply(p: ApplyParams): Promise<void>;
  // informTarget: InformTargetCb;
}
