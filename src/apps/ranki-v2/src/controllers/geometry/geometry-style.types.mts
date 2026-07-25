//
export type TopLeft = { top: number; left: number };

export type TopsLefts = { lefts: number[]; tops: number[] };

export type WidthsHeights = { widths: number[]; heights: number[] };

export type WidthHeight = Pick<DOMRect, "width" | "height">;
