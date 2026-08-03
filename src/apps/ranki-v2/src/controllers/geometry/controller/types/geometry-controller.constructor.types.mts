import type { R2C } from "_components/r2c/r2c.mjs";
import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import type { LayoutSizing } from "../../layout/layout-utils.types.mts";
import type { LitElement } from "lit";
import type { ComponentDims } from "./geometry-controller.types.mts";
import type {
  GeometryEventCb,
  GeometryEventTypes,
} from "_controllers/geometry/events/geometry-events.mjs";

export interface GeometryControllerConstructorParams<
  Instance extends LitElement,
> {
  role: GeometryRole;
  events?: GeometryEventTypes;
  on?: GeometryEventCb<Instance>;
  sets?: GeometrySetRecord<Instance>;
}

export type GeometrySetRecord<Instance extends LitElement> = Record<
  string,
  GeometrySetProps<Instance>
>;

export interface GeometrySetProps<Instance extends LitElement> {
  isRoot?: boolean;
  selector: GeometrySetSelectorCb<Instance>;
  layout?: GeometrySetLayoutCb;
  // !TODO implement geometry diffing and remove this
  diff?: GeometrySetDiffCb<Instance>;
}

export type GeometrySetSelectorCb<Instance extends LitElement> = (
  s: Instance,
) => R2C[];

export type GeometrySetLayoutCb = (
  s: LitElement,
) => (dims: ComponentDims[]) => LayoutSizing | null;

export type GeometrySetDiffCb<Instance extends LitElement> = (
  s: Instance,
) => ReconciliationDiff;

export type GeometryRole = string & { type?: "GeometryRole" };
