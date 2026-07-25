import type { WithEmitIntents } from "../geometry-intent.types.mts";
import type {
  WidthHeight,
  TopsLefts,
  WidthsHeights,
} from "../geometry-style.types.mts";

export type LayoutSizing = WidthHeight &
  TopsLefts &
  WidthsHeights &
  WithEmitIntents;

export interface LayoutGaps {
  start: number;
  gap: number;
  end: number;
}

export interface LayoutGapsParams {
  main?: Partial<LayoutGaps>;
  cross?: Partial<Pick<LayoutGaps, "start" | "end">>;
}
