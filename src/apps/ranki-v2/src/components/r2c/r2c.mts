import { LitElement } from "lit";

export type ListenChildrenEventFunc = (e: ListenChildrenEvent) => void;

export type ListenChildrenEvent = CustomEvent<{ rect: Dims; detail: any }>;

export type Dims = { width: number; height: number };

type Pos = { top: number; left: number };

export type AnimateableStyles = Partial<Dims> & Partial<Pos>;

export type AnimationOptions = Required<
  Pick<KeyframeAnimationOptions, "duration">
> &
  Partial<Pick<KeyframeAnimationOptions, "easing">>;

export interface R2Animate extends LitElement {
  setStyle(pos: AnimateableStyles): void;
  animateStyle(pos: AnimateableStyles, options: AnimationOptions): void;
  informStyle(pos: AnimateableStyles): void;
}

export class SizingUtils {
  public static row(dims: Dims[]): Dims {
    const width = dims.reduce((a, c) => c.width + a, 0);
    const height = dims.reduce((a, c) => Math.max(a, c.height), 0);
    return { width, height };
  }

  public static column(dims: Dims[]): Dims {
    const width = dims.reduce((a, c) => Math.max(a, c.width), 0);
    const height = dims.reduce((a, c) => a + c.height, 0);
    return { width, height };
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

  // public animateListStyle<T extends R2Animate>(
  //   list: T[] | NodeListOf<T>,
  //   pos: AnimateableStyles,
  //   options: AnimationOptions,
  // ) {
  //   list.forEach((f) => {
  //     f.animateStyle(pos, options);
  //   });
  // }

  public informStyle(pos: AnimateableStyles): void {
    this.setStyle(pos);
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
        easing: "cubic-bezier(0.68, -1.55, 0.165, 3.55)",
        fill: "both",
        ...options,
      },
    );
  }

  setStyle(pos: AnimateableStyles) {
    this.animateStyle(pos, { duration: 0 });
  }
}
