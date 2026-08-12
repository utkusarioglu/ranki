import type { R2C } from "_components/r2c/r2c.mjs";
import type {
  InformSetProps,
  LayoutParsed,
  AnimationBlock,
} from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { ChildrenSizing } from "_controllers/geometry/controller/sets/children/children.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/controller/sets/children/layout/layout-utils.types.mjs";
import type {
  CurrentAppliedStyle,
  InformedChildStyle,
} from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type { LitElement } from "lit";

export interface ControllerInformSet {
  host: LitElement;
  props: InformSetProps;
}
export interface AnimatorUpdateComposedProps {
  host: LitElement;
  parsed: LayoutParsed;
  recipe: AnimationBlock;
  curr: CurrentAppliedStyle;
  prev: CurrentAppliedStyle | null;
}
export interface AnimatorPlayNameProps {
  host: LitElement;
  finalOptions: KeyframeAnimationOptions;
  finalKeyframes: Keyframe[];
}
export interface InformStyleDebug {
  host: LitElement;
  curr: CurrentAppliedStyle;
  prev: CurrentAppliedStyle | null;
  sizing: LayoutSizing | null;
  informed: InformedChildStyle;
}
export interface InformSet {
  e: R2C;
  host: LitElement;
  informed: InformedChildStyle;
  props: InformSetProps;
}
export interface AnimatorUpdate {
  host: LitElement;
  curr: CurrentAppliedStyle;
  prev: CurrentAppliedStyle | null;
}
export interface GeometryControllerOnEmitProps {
  host: LitElement;
  update: ChildrenSizing | null;
}
export interface DebugPause {
  duration: number;
  props: any;
}
