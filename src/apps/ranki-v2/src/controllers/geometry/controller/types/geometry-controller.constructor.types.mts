import type { R2C } from "_components/r2c/r2c.mjs";
import type {
  GeometryEventCb,
  GeometryEventTypes,
} from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import type { LitElement } from "lit";
import type { LayoutSizing } from "../../layout/layout-utils.types.mjs";
import type { ComponentDims } from "./geometry-controller.types.mjs";

export interface GeometryControllerConstructorParams<
  Instance extends LitElement,
> {
  role: GeometryRole;
  events?: GeometryEventTypes;
  on?: GeometryEventCb<Instance>;
  sets?: GeometryChildrenRecord<Instance>;
}

export type GeometryChildrenRecord<Instance extends LitElement> = Record<
  string,
  GeometrySetProps<Instance>
>;

export interface GeometrySetProps<Instance extends LitElement> {
  selector: GeometrySetSelectorCb<Instance>;
  isRoot?: boolean;
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
