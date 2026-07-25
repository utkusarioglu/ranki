import type { R2C } from "_components/r2c/r2c.mjs";
import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import type {
  HostType,
  LocalAction,
  ComponentDims,
} from "../geometry.types.mts";
import type { Size } from "../layout/layout-utils.mts";

export interface GeometryControllerConstructorParams<
  Instance extends HostType,
> {
  role: GeometryRole;
  events?: { hover?: boolean };
  on?: GeometryEventCb<Instance>;
  sets?: GeometrySetRecord<Instance>;
}

export type GeometryEventCb<Instance> = (
  s: Instance,
  event: GeometryEventName,
) => void;

export type GeometrySetRecord<Instance extends HostType> = Record<
  string,
  GeometrySetProps<Instance>
>;

export type GeometryEventName = `${LocalAction}-start` & `${LocalAction}-end`;

export interface GeometrySetProps<Instance extends HostType> {
  isRoot?: boolean;
  selector: GeometrySetSelectorCb<Instance>;
  layout?: GeometrySetLayoutCb;
  // !TODO implement geometry diffing and remove this
  diff?: GeometrySetDiffCb<Instance>;
}

export type GeometrySetSelectorCb<Instance extends HostType> = (
  s: Instance,
) => R2C[];

export type GeometrySetLayoutCb = (
  s: HostType,
) => (dims: ComponentDims[]) => Size | null;

export type GeometrySetDiffCb<Instance extends HostType> = (
  s: Instance,
) => ReconciliationDiff;

export type GeometryRole = string & { type?: "GeometryRole" };
