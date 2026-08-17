import type { ReconciliationDiff } from "_utils/reconciliation.utils.mjs";
import type { LitElement } from "lit";

import type { InformedChildStyle } from "../../types/geometry-controller.types.mjs";
import type { GeometrySetSelectorCb } from "../sets.types.mjs";
import type {
  LayoutSizing,
  LayoutSizingCallback,
} from "./layout/layout-utils.types.mjs";
import type { SpanContext } from "@opentelemetry/api";

export type ChildrenSizing =
  | ChildrenSizingRoot
  | ChildrenSizingTerminate
  | ChildrenSizingUpdate;

export interface ChildrenSizingRoot {
  inform: InformedChildStyle;
  session: GeometryUpdateSessionWithSpanContext;
  sizing: LayoutSizing;
  type: "root";
}

export interface ChildrenSizingTerminate {
  session: GeometryUpdateSessionWithSpanContext;
  type: "terminate";
}

export interface ChildrenSizingUpdate {
  session: GeometryUpdateSessionWithSpanContext;
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

export interface GeometryUpdateSessionWithSpanContext extends GeometryUpdateSession {
  context: SpanContext;
}
