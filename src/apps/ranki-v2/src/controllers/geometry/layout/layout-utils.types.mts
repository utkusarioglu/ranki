import type { ComponentDims } from "../controller/types/geometry-controller.types.mjs";
import type { WidthHeight } from "../geometry-style.types.mjs";

export type LayoutSizing = {
  container: WidthHeight;
  set: ComponentDims[];
};

export interface LayoutGaps {
  start: number;
  gap: number;
  end: number;
}

export interface LayoutGapsParams {
  main?: Partial<LayoutGaps>;
  cross?: Partial<Pick<LayoutGaps, "start" | "end">>;
}
