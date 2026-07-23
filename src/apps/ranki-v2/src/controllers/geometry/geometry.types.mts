import type { R2C } from "_components/r2c/r2c.mjs";
import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import type { AnimateableStyles } from "./animator/geometry.animator.types.mjs";
import type { Size } from "_utils/sizing.utils.mjs";
import type { EmitModes } from "_utils/geometry.utils.mjs";
import type { LitElement } from "lit";

export type HostType = LitElement;

export type EmitIntent = "update" | "leave" | "enter" | "mode";

export type WithEmitIntent = { intent: EmitIntent };
export type WithEmitIntents = { intents: EmitIntent[] };

export type WithMode = { mode: EmitModes | undefined };

export type TypedDims = Dims & WithEmitIntent & WithMode;

// !FIX
export type ListenChildrenEventFunc = (e: ListenChildrenEvent) => void;

export type ListenChildrenEvent = CustomEvent<{ rect: Dims; detail: any }>;

export type Dims = Pick<DOMRect, "width" | "height">;

export type TargetSelectorCb<Instance extends HostType> = (
  s: Instance,
) => R2C[];
// export type SizingSelector = Record<string, >;

export type TargetEventCbEvents = `${LocalAction}-start` & `${LocalAction}-end`;

export type TargetEventCb<Instance> = (
  s: Instance,
  event: TargetEventCbEvents,
) => void;

export interface TargetProps<Instance extends HostType> {
  isRoot?: boolean;
  selector: TargetSelectorCb<Instance>;
  sizing?: SizingCb;
  diff?: ReconcilerChangesCb<Instance>;
}

export type TargetRec<Instance extends HostType> = Record<
  string,
  TargetProps<Instance>
>;

/**
 * Lets the host set the start, end margins and the padding between its children
 */
export type SizingCallbackRecord = Record<string, SizingCb>;

export type SizingCb = (s: HostType) => (dims: ComponentDims[]) => Size | null;

export type AnimationRole = string;

export type ReconcilerChangesCb<Instance extends HostType> = (
  s: Instance,
) => ReconciliationDiff;

export type ReconcilerChangesMapCb<Instance extends HostType> = Record<
  string,
  ReconcilerChangesCb<Instance>
>;

export interface GeometryParams<Instance extends HostType> {
  role: AnimationRole;
  events?: { hover?: boolean };
  on?: TargetEventCb<Instance>;
  targets?: TargetRec<Instance>;
}

interface R2CNewChildLeave {
  intent: "leave";
}

interface R2CNewChildMode {
  intent: "mode";
  mode: EmitModes;
}

interface R2CNewChildSizeConnected {
  intent: "connected";
}
interface R2CNewChildSizeDisconnected {
  intent: "disconnected";
}
interface R2CNewChildSizeUpdate {
  intent: "update";
  rect: DOMRect;
}
export type R2CNewChildSizeEvent =
  | R2CNewChildSizeUpdate
  | R2CNewChildSizeDisconnected
  | R2CNewChildSizeConnected
  | R2CNewChildLeave
  | R2CNewChildMode;
export interface ComponentDims {
  component: R2C;
  dims: TypedDims;
}
export type LeftsTops = { lefts: number[]; tops: number[] };
export type WidthsHeights = { widths: number[]; heights: number[] };

export type R2Sizing = Dims & LeftsTops & WidthsHeights;
export type LocalAction =
  | "resize"
  | "none"
  | "enter"
  | "leave"
  | "move"
  | EmitModes;

export type InformedChildStyle = AnimateableStyles &
  WithEmitIntent &
  WithEmitIntents &
  Partial<WithMode>;

export type UpdateStyle = AnimateableStyles & WithEmitIntents;

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
