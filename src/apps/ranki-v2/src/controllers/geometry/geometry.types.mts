import type { R2C } from "_components/r2c/r2c.mjs";
import type { AnimateableStyles } from "./animator/animator.types.mjs";
import type { LitElement } from "lit";
import type { EmitModes } from "./events/geometry-events.types.mts";
import type {
  GeometrySetLayoutCb,
  GeometrySetDiffCb,
} from "./controller/geometry-decorator.constructor.types.mts";

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

// export type SizingSelector = Record<string, >;

/**
 * Lets the host set the start, end margins and the padding between its children
 */
export type SizingCallbackRecord = Record<string, GeometrySetLayoutCb>;

export type AnimationRole = string;

export type ReconcilerChangesMapCb<Instance extends HostType> = Record<
  string,
  GeometrySetDiffCb<Instance>
>;

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
// export type InformSubtreeStyles = LeftsTops;

export type InformTargetStyles = LeftsTops & Partial<WidthsHeights> & Dims;
