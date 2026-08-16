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
  | ChildrenSizingUpdate
  | ChildrenSizingTerminate;

export interface ChildrenSizingRoot {
  inform: InformedChildStyle;
  session: GeometryUpdateSession;
  sizing: LayoutSizing;
  type: "root";
}

export interface ChildrenSizingUpdate {
  sizing: LayoutSizing;
  session: GeometryUpdateSession;
  type: "update";
}

export interface ChildrenSizingTerminate {
  type: "terminate";
  session: GeometryUpdateSession;
}

export interface GeometryUpdateSession {
  id: number;
  start: number;
  index: number;
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
