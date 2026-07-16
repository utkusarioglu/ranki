import type { R2C } from "_components/r2c/r2c.mjs";
import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import type { HostType } from "./layout.controller.types.mts";
import type { LayoutIntent } from "./layout.event.types.mts";
import type { LayoutEventCallback, LayoutSize } from "./layout.types.mts";

export type LayoutSetName = string;

export type TargetRec<Instance extends HostType> = Record<
  string,
  TargetProps<Instance>
>;

export interface TargetProps<Instance extends HostType> {
  isRoot?: boolean;
  selector: SetSelectorCallback<Instance>;
  sizing?: SizingCb;
  on?: LayoutEventCallback<Instance>;
  diff?: ReconcilerChangesCb;
}

export type SetSelectorCallback<Instance extends HostType> = (
  s: Instance,
) => R2C[];

export type SizingCb = (s: HostType) => (dims: ComponentDims[]) => LayoutSize;

export interface ComponentDims {
  component: R2C;
  dims: EmittedToParent;
}
export type ReconcilerChangesCb = (s: HostType) => ReconciliationDiff;

export interface EmittedToParent {
  intent?: LayoutIntent;
  width?: number;
  height?: number;
}

export interface LayoutElemContext {
  length: number;
  stagger: number;
  index: number;
}

// export type InformContext = {
//   index: number;
//   length: number;
//   stagger: number[];
// };
