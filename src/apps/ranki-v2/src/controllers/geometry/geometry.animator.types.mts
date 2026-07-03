import type { Other } from "_components/r2c/r2c.mjs";
import type {
  Dims,
  InformContext,
  LocalAction,
  Pos,
  UpdateStyle,
} from "./geometry.types.mjs";
import type { GeometryController } from "./geometry.mjs";

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

export interface R2CWithGeometry {
  readonly geometry: GeometryController;
}

export type InformTargetCb = (params: InformTargetParams) => Promise<void>;

export type InformTargetParams = {
  id: string;
  curr: UpdateStyle;
  prev: UpdateStyle | null;
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
  Partial<Record<LocalAction, AnimationBlock>>
>;

export type AnimationDict = Record<
  // Preset name
  string,
  TargetAnimationSpec
>;

export interface DecodeParams {
  curr: UpdateStyle;
  prev: UpdateStyle | null;
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
