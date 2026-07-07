import type {
  ComponentDims,
  LeftsTops,
  WidthsHeights,
  WithEmitTypes,
} from "_controllers/geometry/geometry.types.mjs";
import type { Dims } from "_controllers/geometry/geometry.types.mjs";

export type Size = Dims & LeftsTops & WidthsHeights & WithEmitTypes;

export interface SizingGaps {
  start: number;
  gap: number;
  end: number;
}

export type GapsArg = {
  main?: Partial<SizingGaps>;
  cross?: Partial<Pick<SizingGaps, "start" | "end">>;
};

export class SizingUtils {
  public static row(gaps: GapsArg = {}): (d: ComponentDims[]) => Size {
    return (dims: ComponentDims[]) => {
      const s = SizingUtils.linear(
        dims.map((d) => d.dims),
        gaps,
        (v) => v.width,
        (v) => v.height,
      );

      const sizing: Size = {
        types: dims.map((v) => v.dims.type),
        width: s.sizeMain,
        height: s.sizeCross,
        lefts: s.offsetsMain,
        tops: s.offsetsCross,
        widths: s.sizesMain,
        heights: s.sizesCross,
      };

      return sizing;
    };
  }

  private static normalizeGaps(gaps: Partial<SizingGaps> | undefined) {
    return {
      start: 0,
      end: 0,
      gap: 0,
      ...gaps,
    };
  }

  private static linear(
    dims: Dims[],
    gaps: GapsArg = {},
    getMain: (v: Dims) => number,
    getCross: (v: Dims) => number,
  ) {
    const main = SizingUtils.normalizeGaps(gaps.main);
    const cross = SizingUtils.normalizeGaps(gaps.cross);
    const spacingMain = main.gap * (dims.length - 1) + main.start + main.end;
    const spacingCross = cross.start + cross.end;
    const sizeCross =
      dims.reduce((a, c) => Math.max(a, getCross(c)), 0) + spacingCross;
    const sizeMain = dims.reduce((a, c) => a + getMain(c), 0) + spacingMain;

    const offsetsMain = Array(dims.length).fill(0);
    offsetsMain[0] = main.start;
    for (let i = 0; i < dims.length; i++) {
      if (i === 0) continue;
      offsetsMain[i] = offsetsMain[i - 1] + getMain(dims[i - 1]) + main.gap;
    }

    const offsetsCross = Array(dims.length)
      .fill(0)
      .map((_, i) => (sizeCross - getCross(dims[i])) / 2);
    const sizesMain = dims.map((d) => getMain(d));
    const sizesCross = dims.map((d) => getCross(d));
    return {
      sizeCross,
      sizeMain,
      offsetsCross,
      offsetsMain,
      sizesMain,
      sizesCross,
    };
  }

  /**
   * main axis is inline, cross axis is block
   */
  public static last(
    gaps: GapsArg = {},
  ): (dims: ComponentDims[]) => Size | null {
    return (dims: ComponentDims[]) => {
      const last = dims.at(-1);
      if (!last) return null;

      const zeros = Array.from({ length: dims.length - 1 }, () => 0);
      const width =
        last.dims.width + (gaps.main?.start || 0) + (gaps.main?.end || 0);
      const height =
        last.dims.height + (gaps.cross?.start || 0) + (gaps.cross?.end || 0);
      const lefts = [...zeros, gaps.main?.start || 0];
      const tops = [...zeros, gaps.cross?.start || 0];
      const heights = [...zeros, last.dims.height];
      const widths = [...zeros, last.dims.width];

      return {
        types: dims.map((d) => d.dims.type),
        width,
        height,
        lefts,
        tops,
        heights,
        widths,
      };
    };
  }
}
