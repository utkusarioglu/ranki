import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import type { LitElement } from "lit";

import type { InformedChildStyle } from "../../types/geometry-controller.types.mjs";
import type { GeometrySetSelectorCb } from "../sets.types.mjs";
import type {
  LayoutSizing,
  LayoutSizingCallback,
} from "./layout/layout-utils.types.mjs";

export type ChildrenSizing =
  | ChildrenSizingRoot
  | ChildrenSizingTerminate
  | ChildrenSizingUpdate;

export interface ChildrenSizingRoot {
  inform: InformedChildStyle;
  session: GeometryUpdateSession;
  sizing: LayoutSizing;
  type: "root";
}

export interface ChildrenSizingTerminate {
  session: GeometryUpdateSession;
  type: "terminate";
}

export interface ChildrenSizingUpdate {
  session: GeometryUpdateSession;
  sizing: LayoutSizing;
  type: "update";
}

export type ChildrenUpdateSizingReturn = Promise<ChildrenSizing>;

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

export interface GeometryUpdateSession {
  id: number;
  index: number;
  start: number;
}
