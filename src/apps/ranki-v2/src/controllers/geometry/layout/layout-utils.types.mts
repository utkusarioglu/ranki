import type { ComponentDims } from "../controller/types/geometry-controller.types.mjs";
import type { WidthHeight } from "../geometry-style.types.mjs";

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
  set: ComponentDims[];
};
