import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type { InformedChildStyle } from "../types/geometry-controller.types.mjs";

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
