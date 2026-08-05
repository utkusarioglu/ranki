import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type {
  ComponentDims,
  InformedChildStyle,
} from "../types/geometry-controller.types.mjs";
import type { GeometrySetSelectorCb } from "../types/geometry-controller.constructor.types.mjs";
import type { LitElement } from "lit";
import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";

export type ChildrenUpdateSizingReturn = Promise<ChildrenSizing | null>;

export type ChildrenSizing = ChildrenSizingRoot | ChildrenSizingUpdate;

export interface ChildrenSizingRoot {
  type: "root";
  sizing: LayoutSizing;
  inform: InformedChildStyle;
}

export interface ChildrenSizingUpdate {
  type: "update";
  sizing: LayoutSizing;
}

export interface GeometryChildrenProps<Instance extends LitElement> {
  selector: GeometrySetSelectorCb<Instance>;
  isRoot?: boolean;
  layout?: GeometrySetLayoutCb;
  // !TODO implement geometry diffing and remove this
  diff?: GeometrySetDiffCb<Instance>;
}

export type GeometrySetLayoutCb = (
  s: LitElement,
) => (dims: ComponentDims[]) => LayoutSizing | null;

export type GeometrySetDiffCb<Instance extends LitElement> = (
  s: Instance,
) => ReconciliationDiff;
