import type { EmittedComponentState } from "../controller/sets/children/registry/children-registry.types.mjs";
import type { ComponentDims } from "../controller/types/geometry-controller.types.mjs";
import type { TopLeft, WidthHeight } from "../geometry-style.types.mjs";

export interface ComponentDimsPositioned extends ComponentDims {
  style: ComponentDims["style"] & TopLeft;
}

export interface LayoutGaps {
  end: number;
  gap: number;
  start: number;
}

export interface LayoutGapsParams {
  cross?: Partial<Pick<LayoutGaps, "end" | "start">>;
  main?: Partial<LayoutGaps>;
}

export type LayoutSizing = {
  container: WidthHeight;
  set: ComponentDimsPositioned[];
};

export type LayoutSizingCallback = (
  dims: EmittedComponentState[],
) => LayoutSizing;
