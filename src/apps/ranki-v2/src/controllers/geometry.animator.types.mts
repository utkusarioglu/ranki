import type { Other } from "_components/r2c/r2c.mjs";
import type {
  Dims,
  InformContext,
  InformTargetStyles,
  Pos,
  UpdateStyle,
} from "./geometry.types.mts";
import type { GeometryController } from "./geometry.mts";
import type { ReconciliationChanges } from "_utils/reconciliation.mjs";

export type ImmediateStyles = { zIndex?: number } & AnimateableStyles;

export type AnimateableStyles = Partial<Dims> &
  Partial<Pos> &
  Partial<Anim> &
  Partial<Other>;

export type AnimationOptions = Required<
  Pick<KeyframeAnimationOptions, "duration">
> &
  Partial<Pick<KeyframeAnimationOptions, "easing" | "delay">>;
export type AnimationCallback = (
  curr: UpdateStyle,
  prev: UpdateStyle | null,
  context: InformContext,
) => Promise<void>;

export type AnimationPack = Record<
  "expand" | "contract" | "none",
  AnimationCallback
>;

export type Anim = {
  easing: string;
};

export interface R2CWithGeometry {
  readonly geometry: GeometryController;
}

export type InformTargetCb = (params: InformTargetParams) => Promise<void>;

export type InformTargetParams = {
  target: string;
  curr: InformTargetStyles;
  // changes: ReconciliationChanges;
};
