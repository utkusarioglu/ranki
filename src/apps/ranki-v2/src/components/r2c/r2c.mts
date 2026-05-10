import { LitElement } from "lit";

export type ListenChildrenEventFunc = (e: ListenChildrenEvent) => void;

export type ListenChildrenEvent = CustomEvent<{ rect: Dims; detail: any }>;

export type Dims = {
  width: number;
  height: number;
};

export type Sizing = Dims & {
  lefts: number[];
  tops: number[];
};

type Pos = { top: number; left: number };

export type AnimateableStyles = Partial<Dims> & Partial<Pos>;

export type AnimationOptions = Required<
  Pick<KeyframeAnimationOptions, "duration">
> &
  Partial<Pick<KeyframeAnimationOptions, "easing">>;

export interface R2Animate extends LitElement {
  setStyle(pos: AnimateableStyles): this;
  animateStyle(pos: AnimateableStyles, options: AnimationOptions): this;
  informStyle(pos: AnimateableStyles): void;
}

export interface SizingGaps {
  start: number;
  inBetween: number;
  end: number;
}

type GapsArg = {
  main?: Partial<SizingGaps>;
  cross?: Partial<Pick<SizingGaps, "start" | "end">>;
};

export class SizingUtils {
  public static row(dims: Dims[], gaps: GapsArg = {}): Sizing {
    // const width = dims.reduce((a, c) => c.width + a, 0);
    // const height = dims.reduce((a, c) => Math.max(a, c.height), 0);
    // return { width, height, lefts: [], tops: [] };

    const s = SizingUtils.linear(
      dims,
      gaps,
      (v) => v.width,
      (v) => v.height,
    );

    return {
      width: s.sizeMain,
      height: s.sizeCross,
      lefts: s.offsetMain,
      tops: s.offsetCross,
    };
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

  public static column(dims: Dims[], gaps: GapsArg = {}): Sizing {
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

export class CollectionUtils {
  /**
   * This method is created because `NodeListOf` type doesn't support `indexOf` array method;
   */
  static indexOf<T extends R2C>(
    list: T[] | NodeListOf<T>,
    searched: T,
  ): number {
    let index = -1;
    for (let i = 0; i < list.length; i++) {
      if (list[i] === searched) {
        index = i;
        break;
      }
    }
    return index;
  }

  static nullArray<T extends R2C>(list: T[] | NodeListOf<T>) {
    return Array(list.length).fill(null);
  }
}

export class R2C extends LitElement implements R2Animate {
  protected dims: Dims[] = [];

  protected emitChildLoad(rect: Dims, extra: CustomEvent["detail"]) {
    const evt = new CustomEvent("child-load", {
      detail: { rect, extra },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(evt);
  }

  protected waitForDimensions<T extends R2C>(
    watchList: T[] | NodeListOf<T>,
    then: (d: Dims[]) => void,
  ) {
    this.dims = CollectionUtils.nullArray(watchList);
    this.addEventListener("child-load", (e) => {
      const first = e.composedPath()[0] as R2C;
      if (first === this) return;
      e.stopPropagation();
      const index = CollectionUtils.indexOf(watchList, first);
      if (index === -1) return;
      this.dims.splice(index, 1, (e as ListenChildrenEvent).detail.rect);

      const isIncomplete = this.dims.some((v) => v === null);
      if (isIncomplete) return;

      then([...this.dims]);
      this.dims = CollectionUtils.nullArray(watchList);
    });
  }

  public informStyle(pos: AnimateableStyles): void {
    console.log("styleinform", this, pos);
    // this.setStyle(pos);
  }

  public animateStyle(pos: AnimateableStyles, options: AnimationOptions) {
    let transform = {};
    const hasLeft = pos.left !== undefined;
    const hasTop = pos.top !== undefined;
    if (hasLeft || hasTop) {
      const maybe = [
        hasLeft ? "translateX(" + pos.left + "px)" : undefined,
        hasTop ? "translateY(" + pos.top + "px)" : undefined,
      ]
        .filter((v) => !!v)
        .join(" ");
      if (maybe.length) {
        transform = { transform: maybe };
      }
    }
    this.animate(
      {
        ...transform,
        ...(pos.width ? { width: pos.width + "px" } : {}),
        ...(pos.height ? { height: pos.height + "px" } : {}),
      },
      {
        // easing: "ease-in-out",
        // easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        easing: "cubic-bezier(0.68, 1.55, 0.165, 3.55)",
        // easing: "linear",
        fill: "both",
        ...options,
      },
    );
    return this;
  }

  setStyle(pos: AnimateableStyles) {
    this.animateStyle(pos, { duration: 0 });
    return this;
  }
}
