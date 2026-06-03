import type { R2C } from "_components/r2c/r2c.mjs";
import type { ReconciliationDiff } from "_utils/reconciliation.mjs";
import type { AnimateableStyles } from "./geometry.animator.types.mjs";

type LitInstance = any;
export type ListenChildrenEventFunc = (e: ListenChildrenEvent) => void;

export type ListenChildrenEvent = CustomEvent<{ rect: Dims; detail: any }>;

export type Dims = Pick<DOMRect, "width" | "height">;

export type TargetSelectorCb = (s: LitInstance) => R2C[];
// export type SizingSelector = Record<string, >;

export type TargetEventCbEvents = `${LocalAction}-start` & `${LocalAction}-end`;

export type TargetEventCb = (
  s: LitInstance,
  event: TargetEventCbEvents,
) => void;

export interface TargetProps {
  isRoot?: boolean;
  selector: TargetSelectorCb;
  sizing?: SizingCb;
  diff?: ReconcilerChangesCb;
}

export type TargetRec = Record<string, TargetProps>;

/**
 * Lets the host set the start, end margins and the padding between its children
 */
export type SizingCallbackRecord = Record<string, SizingCb>;

export type SizingCb = (dims: ComponentDims[]) => R2Sizing | null;

export type AnimationRole = string;

export type ReconcilerChangesCb = (s: LitInstance) => ReconciliationDiff;

export type ReconcilerChangesMapCb = Record<string, ReconcilerChangesCb>;

export interface GeometryParams {
  role: AnimationRole;
  on?: TargetEventCb;
  targets?: TargetRec;
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

export type R2Sizing = Dims & LeftsTops & WidthsHeights;
export type LocalAction = "expand" | "contract" | "none" | "enter" | "exit";
// OBSOLETE
// export type DirectionalEvaluation = {
//   isExpanding: boolean;
//   isContracting: boolean;
//   action: LocalAction;
// };
// export type InformStyle = Partial<Pos> & Partial<Dims>;
export type InformStyle = AnimateableStyles;

export type UpdateStyle = InformStyle &
  R2Sizing &
  UpdateEvaluations &
  WidthsHeights;

type UpdateEvaluations = {
  action: LocalAction;
};
// type UpdateEvaluations = {
//   main: DirectionalEvaluation;
//   cross: DirectionalEvaluation;
// };
export type InformContext = {
  index: number;
  length: number;
  stagger: number[];
};

export interface GeometryDiff {
  stagger: {
    first: number;
    indices: number[];
  };
}
export type Pos = { top: number; left: number };

// OBSOLETE
export type InformSubtreeStyles = LeftsTops;

export type InformTargetStyles = LeftsTops & Partial<WidthsHeights> & Dims;
