import type { ComponentDims, Dims, R2C } from "../components/r2c/r2c.mts";

export type Size = Dims & {
  lefts: number[];
  tops: number[];
};

export interface SizingGaps {
  start: number;
  inBetween: number;
  end: number;
}

export type GapsArg = {
  main?: Partial<SizingGaps>;
  cross?: Partial<Pick<SizingGaps, "start" | "end">>;
};

export class SizingUtils {
  public static row(dims: Dims[], gaps: GapsArg = {}): Size {
    const s = SizingUtils.linear(
      dims,
      gaps,
      (v) => v.width,
      (v) => v.height,
    );

    const sizing = {
      width: s.sizeMain,
      height: s.sizeCross,
      lefts: s.offsetMain,
      tops: s.offsetCross,
    };

    return sizing;
  }

  private static normalizeGaps(gaps: Partial<SizingGaps> | undefined) {
    return {
      start: 0,
      end: 0,
      inBetween: 0,
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
    const spacingMain =
      main.inBetween * (dims.length - 1) + main.start + main.end;
    const spacingCross = cross.start + cross.end;
    const sizeCross =
      dims.reduce((a, c) => Math.max(a, getCross(c)), 0) + spacingCross;
    const sizeMain = dims.reduce((a, c) => a + getMain(c), 0) + spacingMain;

    const offsetMain = Array(dims.length).fill(0);
    offsetMain[0] = main.start;
    for (let i = 0; i < dims.length; i++) {
      if (i === 0) continue;
      offsetMain[i] = offsetMain[i - 1] + getMain(dims[i - 1]) + main.inBetween;
    }

    const offsetCross = Array(dims.length)
      .fill(0)
      .map((_, i) => (sizeCross - getCross(dims[i])) / 2);
    return {
      sizeCross,
      sizeMain,
      offsetCross,
      offsetMain,
    };
  }

  /**
   * main axis is inline, cross axis is block
   */
  public static last(dims: ComponentDims[], gaps: GapsArg = {}): Size | null {
    const last = dims.at(-1);
    if (!last) return null;

    const width =
      last.dims.width + (gaps.main?.start || 0) + (gaps.main?.end || 0);
    const height =
      last.dims.height + (gaps.cross?.start || 0) + (gaps.cross?.end || 0);
    const lefts = [gaps.main?.start || 0];
    const tops = [gaps.cross?.start || 0];

    return {
      width,
      height,
      lefts,
      tops,
    };
  }
}
