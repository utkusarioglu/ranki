import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import type { LitElement } from "lit";

import type { InformedChildStyle } from "../../types/geometry-controller.types.mjs";
import type { GeometrySetSelectorCb } from "../sets.types.mjs";
import type {
  LayoutSizing,
  LayoutSizingCallback,
} from "./layout/layout-utils.types.mjs";

export type ChildrenSizing = ChildrenSizingRoot | ChildrenSizingUpdate;

export interface ChildrenSizingRoot {
  inform: InformedChildStyle;
  sizing: LayoutSizing;
  type: "root";
}

export interface ChildrenSizingUpdate {
  sizing: LayoutSizing;
  type: "update";
}

export type ChildrenUpdateSizingReturn = Promise<ChildrenSizing | null>;

export type GeometryChildrenLayoutCallback = (
  s: LitElement,
) => LayoutSizingCallback;

export interface GeometryChildrenProps<Instance extends LitElement> {
  // !TODO implement geometry diffing and remove this
  diff?: GeometrySetDiffCb<Instance>;
  /**
   * @default false
   */
  isRoot?: boolean;
  /**
   * @default LayoutUtils.row
   */
  layout?: GeometryChildrenLayoutCallback;
  selector: GeometrySetSelectorCb<Instance>;
}

export type GeometrySetDiffCb<Instance extends LitElement> = (
  s: Instance,
) => ReconciliationDiff;
