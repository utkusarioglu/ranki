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
  public static rowOld(self: R2C, gaps: GapsArg = {}): Size {
    const dims = self.getDims();
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

    self.setSizing(sizing);

    return sizing;
  }

  public static row(dims: Dims[], gaps: GapsArg = {}): Size {
    // const dims = self.getDims();
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

    // self.setSizing(sizing);

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

    const offsetCross = Array(dims.length).fill(0);
    return {
      sizeCross,
      sizeMain,
      offsetCross,
      offsetMain,
    };
  }

  public static columnOld(self: R2C, gaps: GapsArg = {}): Size {
    const dims = self.getDims();
    const s = SizingUtils.linear(
      dims,
      gaps,
      (v) => v.height,
      (v) => v.width,
    );

    return {
      height: s.sizeMain,
      width: s.sizeCross,
      tops: s.offsetMain,
      lefts: s.offsetCross,
    };
  }
}
