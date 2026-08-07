import type { ComponentDims } from "../controller/types/geometry-controller.types.mjs";
import type {
  LayoutGaps,
  LayoutGapsParams,
  LayoutSizing,
} from "./layout-utils.types.mjs";

export class LayoutUtils {
  /**
   * main axis is inline, cross axis is block
   */
  public static last(
    gaps: LayoutGapsParams = {},
  ): (dims: ComponentDims[]) => LayoutSizing | null {
    return (dims: ComponentDims[]) => {
      const last = dims.at(-1);
      if (!last) return null;

      const zeros = Array.from({ length: dims.length - 1 }, () => 0);
      const width =
        last.style.width + (gaps.main?.start || 0) + (gaps.main?.end || 0);
      const height =
        last.style.height + (gaps.cross?.start || 0) + (gaps.cross?.end || 0);

      const lefts = [...zeros, gaps.main?.start || 0];
      const tops = [...zeros, gaps.cross?.start || 0];
      const heights = [...zeros, last.style.height];
      const widths = [...zeros, last.style.width];
      const intents = dims.map((d) => d.intent);

      const set = Array.from({ length: dims.length }, (_, i) => i).map((i) => ({
        intent: intents[i],
        style: {
          height: heights[i],
          left: lefts[i],
          top: tops[i],
          width: widths[i],
        },
      }));

      return {
        container: {
          height,
          width,
        },
        set,
      };
    };
  }

  public static row(
    gaps: LayoutGapsParams = {},
  ): (d: ComponentDims[]) => LayoutSizing {
    return (dims: ComponentDims[]) => {
      const s = LayoutUtils.linear(
        dims,
        gaps,
        (v) => v.width,
        (v) => v.height,
      );

      const sizing: LayoutSizing = {
        container: {
          height: s.container.sizeCross,
          width: s.container.sizeMain,
        },

        set: s.set.map((s) => ({
          intent: s.intent,
          style: {
            height: s.style.sizeCross,
            left: s.style.offsetMain,
            top: s.style.offsetCross,
            width: s.style.sizeMain,
          },
        })),
      };

      return sizing;
    };
  }

  private static linear(
    dims: ComponentDims[],
    gaps: LayoutGapsParams = {},
    getMain: (v: ComponentDims["style"]) => number,
    getCross: (v: ComponentDims["style"]) => number,
  ) {
    const main = LayoutUtils.normalizeGaps(gaps.main);
    const cross = LayoutUtils.normalizeGaps(gaps.cross);
    const spacingMain = main.gap * (dims.length - 1) + main.start + main.end;
    const spacingCross = cross.start + cross.end;
    const sizeCross =
      dims.reduce((a, c) => Math.max(a, getCross(c.style)), 0) + spacingCross;
    const sizeMain =
      dims.reduce((a, c) => a + getMain(c.style), 0) + spacingMain;

    const offsetsMain = Array(dims.length).fill(0);
    offsetsMain[0] = main.start;
    for (let i = 0; i < dims.length; i++) {
      if (i === 0) continue;
      offsetsMain[i] =
        offsetsMain[i - 1] + getMain(dims[i - 1].style) + main.gap;
    }

    const offsetsCross = Array(dims.length)
      .fill(0)
      .map((_, i) => (sizeCross - getCross(dims[i].style)) / 2);
    const sizesMain = dims.map((d) => getMain(d.style));
    const sizesCross = dims.map((d) => getCross(d.style));

    const intents = dims.map((v) => v.intent);

    const set = Array.from({ length: dims.length }, (_, i) => i).map((i) => ({
      intent: intents[i],
      style: {
        offsetCross: offsetsCross[i],
        offsetMain: offsetsMain[i],
        sizeCross: sizesCross[i],
        sizeMain: sizesMain[i],
      },
    }));

    return {
      container: {
        sizeCross,
        sizeMain,
      },
      set,
    };
  }

  private static normalizeGaps(gaps: Partial<LayoutGaps> | undefined) {
    return {
      end: 0,
      gap: 0,
      start: 0,
      ...gaps,
    };
  }
}
