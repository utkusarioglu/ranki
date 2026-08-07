import type { ComponentDims } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type {
  TopLeft,
  WidthHeight,
} from "_controllers/geometry/geometry-style.types.mjs";

import type { EmittedComponentState } from "../registry/children-registry.types.mjs";

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
