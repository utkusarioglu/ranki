import type { R2C } from "_components/r2c/r2c.mjs";
import type { ReconciliationChanges } from "_utils/reconciliation.mjs";
import type { R2CWithGeometry } from "./geometry.animator.types.mts";

type LitInstance = any;
export type ListenChildrenEventFunc = (e: ListenChildrenEvent) => void;

export type ListenChildrenEvent = CustomEvent<{ rect: Dims; detail: any }>;

export type Dims = Pick<DOMRect, "width" | "height">;

export type SizingSelector = Record<string, (s: LitInstance) => R2C[]>;

/**
 * Lets the host set the start, end margins and the padding between its children
 */
export type SizingCallback = (dims: ComponentDims[]) => R2Sizing | null;

export type AnimationRole = string;

export type ReconcilerChangesMapCb = Record<
  string,
  (s: LitInstance) => ReconciliationChanges
>;

export interface GeometryParams {
  selector: SizingSelector;
  sizing: SizingCallback;
  changes: ReconcilerChangesMapCb;
  role: AnimationRole;
}

// TODO put into use
// export interface UpdateStyleParams {
//   curr: UpdateStyle;
//   prev: UpdateStyle | null;
//   context: InformContext;
// }

interface R2CNewChildSizeConnected {
  type: "connected";
}
interface R2CNewChildSizeDisconnected {
  type: "disconnected";
}
interface R2CNewChildSizeUpdate {
  type: "update";
  rect: DOMRect;
}
export type R2CNewChildSizeEvent =
  | R2CNewChildSizeUpdate
  | R2CNewChildSizeDisconnected
  | R2CNewChildSizeConnected;
export interface ComponentDims {
  component: R2C;
  dims: Dims;
}
export type LeftsTops = { lefts: number[]; tops: number[] };
export type WidthsHeights = { widths: number[]; heights: number[] };

export type R2Sizing = Dims & LeftsTops;
type LocalAction = "expand" | "contract" | "none";
export type DirectionalEvaluation = {
  isExpanding: boolean;
  isContracting: boolean;
  action: LocalAction;
};
export type InformStyle = Pos & Partial<Dims>;

export type UpdateStyle = InformStyle & R2Sizing & UpdateEvaluations;
type UpdateEvaluations = {
  main: DirectionalEvaluation;
  cross: DirectionalEvaluation;
};
export type InformContext = {
  index: number;
  length: number;
  changes: ReconciliationChanges;
};
export type Pos = { top: number; left: number };

// OBSOLETE
export type InformSubtreeStyles = LeftsTops;

export type InformTargetStyles = LeftsTops & Partial<WidthsHeights>;
