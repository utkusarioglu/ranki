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
    return (dims: EmittedComponentState[]) => {
      const last = dims.at(-1);
      if (!last) return this.EMPTY_SIZING;

      const lastLeft = gaps.main?.start || 0;
      const lastTop = gaps.cross?.start || 0;
      const lastWidth = last.style?.width || 0;
      const lastHeight = last.style?.height || 0;

      const containerWidth =
        lastWidth + (gaps.main?.start || 0) + (gaps.main?.end || 0);
      const containerHeight =
        lastHeight + (gaps.cross?.start || 0) + (gaps.cross?.end || 0);

      const set = Array.from({ length: dims.length }, (_, i) => ({
        interaction: dims[i].interaction,
        lifecycle: dims[i].lifecycle,
        mode: dims[i].mode,
        style: {
          height: lastHeight,
          width: lastWidth,
          top: lastTop,
          left: lastLeft,
        },
      }));

      return {
        container: {
          height: containerHeight,
          width: containerWidth,
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
          interaction: s.interaction,
          lifecycle: s.lifecycle,
          mode: s.mode,
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
    allDims: EmittedComponentState[],
    gaps: LayoutGapsParams = {},
    getMain: (v: EmittedComponentState["style"]) => number,
    getCross: (v: EmittedComponentState["style"]) => number,
  ) {
    const main = LayoutUtils.normalizeGaps(gaps.main);
    const cross = LayoutUtils.normalizeGaps(gaps.cross);
    const filteredDims = allDims.filter(
      (d) => d.lifecycle !== "leave" && d.lifecycle !== "none",
    );
    // container
    const spacingMain =
      main.gap * (filteredDims.length - 1) + main.start + main.end;
    const spacingCross = cross.start + cross.end;
    const sizeCross =
      filteredDims.reduce((a, c) => Math.max(a, getCross(c.style)), 0) +
      spacingCross;
    const sizeMain =
      filteredDims.reduce((a, c) => a + getMain(c.style), 0) + spacingMain;

    // sets
    const offsetsMain = Array(allDims.length).fill(0);
    offsetsMain[0] = main.start;
    for (let i = 0; i < allDims.length; i++) {
      if (i === 0) continue;
      offsetsMain[i] =
        offsetsMain[i - 1] + getMain(allDims[i - 1].style) + main.gap;
    }
    const offsetsCross = Array(allDims.length)
      .fill(0)
      .map((_, i) => (sizeCross - getCross(allDims[i].style)) / 2);
    const sizesMain = allDims.map((d) => getMain(d.style));
    const sizesCross = allDims.map((d) => getCross(d.style));

    const intents = allDims.map((v) => v.lifecycle);
    const interactions = allDims.map((v) => v.interaction);
    const modes = allDims.map((v) => v.mode);

    const set = Array.from({ length: allDims.length }, (_, i) => i).map(
      (i) => ({
        interaction: interactions[i],
        lifecycle: intents[i],
        mode: modes[i],
        style: {
          offsetCross: offsetsCross[i],
          offsetMain: offsetsMain[i],
          sizeCross: sizesCross[i],
          sizeMain: sizesMain[i],
        },
      }),
    );

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
