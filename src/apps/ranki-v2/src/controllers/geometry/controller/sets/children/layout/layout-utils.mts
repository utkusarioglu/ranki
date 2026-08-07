import type { EmittedComponentState } from "../registry/children-registry.types.mjs";
import type {
  LayoutGaps,
  LayoutGapsParams,
  LayoutSizing,
  LayoutSizingCallback,
} from "./layout-utils.types.mjs";

export class LayoutUtils {
  public static EMPTY_SIZING: LayoutSizing = {
    container: {
      height: 0,
      width: 0,
    },
    set: [],
  };
  /**
   * main axis is inline, cross axis is block
   */
  public static last(gaps: LayoutGapsParams = {}): LayoutSizingCallback {
    // (dims: ComponentDims[]) => LayoutSizing | null {
    return (dims: EmittedComponentState[]) => {
      const last = dims.at(-1);
      if (!last) return this.EMPTY_SIZING;

      const lastWidth = last.style?.width || 0;
      const lastHeight = last.style?.height || 0;
      const zeros = Array.from({ length: dims.length - 1 }, () => 0);
      const width = lastWidth + (gaps.main?.start || 0) + (gaps.main?.end || 0);
      const height =
        lastHeight + (gaps.cross?.start || 0) + (gaps.cross?.end || 0);

      const lefts = [...zeros, gaps.main?.start || 0];
      const tops = [...zeros, gaps.cross?.start || 0];
      const heights = [...zeros, lastHeight];
      const widths = [...zeros, lastWidth];
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

  public static row(gaps: LayoutGapsParams = {}): LayoutSizingCallback {
    return (dims: EmittedComponentState[]) => {
      const s = LayoutUtils.linear(
        dims,
        gaps,
        (v) => (v ? v.width : 0),
        (v) => (v ? v.height : 0),
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
    dims: EmittedComponentState[],
    gaps: LayoutGapsParams = {},
    getMain: (v: EmittedComponentState["style"]) => number,
    getCross: (v: EmittedComponentState["style"]) => number,
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
