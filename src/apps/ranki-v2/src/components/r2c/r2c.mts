import { LitElement } from "lit";
import { CollectionUtils } from "../../utils/Collection.mts";
import { TimingUtils } from "_utils/timing.mjs";
import type { Size } from "_utils/Sizing.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";

export type ListenChildrenEventFunc = (e: ListenChildrenEvent) => void;

export type ListenChildrenEvent = CustomEvent<{ rect: Dims; detail: any }>;

export type Dims = {
  width: number;
  height: number;
};

type Pos = { top: number; left: number };

type Anim = {
  easing: string;
};

export type AnimateableStyles = Partial<Dims> & Partial<Pos> & Partial<Anim>;

export type AnimationOptions = Required<
  Pick<KeyframeAnimationOptions, "duration">
> &
  Partial<Pick<KeyframeAnimationOptions, "easing">>;

export interface R2Animate extends LitElement {
  setStyle(pos: AnimateableStyles): this;
  animateStyle(pos: AnimateableStyles, options: AnimationOptions): this;
  informStyle(pos: AnimateableStyles): void;
}

export class R2C extends LitElement implements R2Animate {
  protected dims: Dims[] = [];
  protected dimsUpdated = false;
  private dimsWatchList: R2C[] | NodeListOf<R2C> | undefined;
  private dimsSizing!: Size;

  public setSizing(sizing: Size) {
    this.dimsSizing = sizing;
  }

  public getSizing() {
    assertNotUndefined(this.dimsSizing, {
      why: "Sizing hasn't been populated. Have you not called SizingUtils?",
    });
    return this.dimsSizing;
  }

  public getDims(): Dims[] {
    return this.dims;
  }

  public getDimWatched() {
    assertNotUndefined(this.dimsWatchList, {
      why: "Watch list hasn't been set. Are you sure you're watching any nodes",
    });
    return this.dimsWatchList;
  }

  protected emitChildLoad(rect: Dims, extra: CustomEvent["detail"]) {
    const evt = new CustomEvent("child-load", {
      detail: { rect, extra },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(evt);
  }

  protected watchDims<T extends R2C>(
    getWatchList: () => T[] | NodeListOf<T>,
    then: (d: Dims[]) => void,
  ) {
    this.addEventListener("child-load", (e) => {
      if (this.dimsWatchList === undefined) {
        this.dimsWatchList = getWatchList();
        this.dims = Array(this.dimsWatchList.length)
          .fill(null)
          .map(() => ({
            width: 0,
            height: 0,
          }));
      }
      const first = e.composedPath()[0] as R2C;
      if (first === this) return;
      e.stopPropagation();
      const index = CollectionUtils.indexOf(this.dimsWatchList, first);
      if (index === -1) return;
      this.dimsUpdated = true;
      this.dims.splice(index, 1, (e as ListenChildrenEvent).detail.rect);
      TimingUtils.raf(1, () => {
        this.dimsUpdated = false;
        then([...this.dims]);
      });
    });
  }

  public informStyle(pos: AnimateableStyles): void {
    console.log("styleinform", this, pos);
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
        // easing: "cubic-bezier(0.68, 1.55, 0.165, 3.55)",
        easing: "linear",
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
