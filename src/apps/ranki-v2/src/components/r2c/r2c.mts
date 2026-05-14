import { LitElement } from "lit";
import { CollectionUtils } from "../../utils/Collection.mts";
import { TimingUtils } from "_utils/timing.mjs";
import type { Size } from "_utils/Sizing.mjs";
import { assertNever, assertNotUndefined } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";

export type ListenChildrenEventFunc = (e: ListenChildrenEvent) => void;

export type ListenChildrenEvent = CustomEvent<{ rect: Dims; detail: any }>;

// export type Dims = {
//   width: number;
//   height: number;
// };

export type Dims = Pick<DOMRect, "width" | "height">;

type Pos = { top: number; left: number };

type Anim = {
  easing: string;
};

type Other = {
  opacity: number;
};

export type AnimateableStyles = Partial<Dims> &
  Partial<Pos> &
  Partial<Anim> &
  Partial<Other>;

export type AnimationOptions = Required<
  Pick<KeyframeAnimationOptions, "duration">
> &
  Partial<Pick<KeyframeAnimationOptions, "easing" | "delay">>;

export interface R2Animate extends LitElement {
  setStyle(pos: AnimateableStyles): this;
  animateStyle(pos: AnimateableStyles, options: AnimationOptions): this;
  informStyle(pos: AnimateableStyles): void;
}

interface R2CNewChildSizeConnected {
  type: "connected";
}
interface R2CNewChildSizeDisconnected {
  type: "disconnected";
}

interface R2CNewChildSizeUpdate {
  type: "update";
  rect: DOMRect;
}

type R2CNewChildSizeEvent =
  | R2CNewChildSizeUpdate
  | R2CNewChildSizeDisconnected
  | R2CNewChildSizeConnected;

export interface ComponentDims {
  component: R2CNew;
  dims: Dims;
}

export class R2CNew extends LitElement {
  private registered = new WeakMap<R2CNew, Dims>();
  // private registered: ComponentRegistration[] = [];

  protected getSizeList() {
    return Array.from(this.shadowRoot!.children) as R2CNew[];
  }

  protected emitSize({ width, height }: Dims | DOMRect) {
    // const { width, height } = this.getBoundingClientRect();
    this.dispatchEvent(
      new CustomEvent("r2-child-size", {
        detail: {
          type: "update",
          rect: { width, height },
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  connectedCallback(): void {
    this.dispatchEvent(
      new CustomEvent("r2-child-size", {
        detail: {
          type: "connected",
        },
        bubbles: true,
        composed: true,
      }),
    );
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.dispatchEvent(
      new CustomEvent("r2-child-size", {
        detail: {
          type: "disconnected",
        },
        bubbles: true,
        composed: true,
      }),
    );
    super.disconnectedCallback();
  }

  protected onChildSize(e: CustomEvent<R2CNewChildSizeEvent>) {
    e.stopPropagation();
    const detail = e.detail;

    const target = e.composedPath()[0] as R2CNew;
    if (!target)
      throw new RankiAppError({
        code: "NO_TARGET",
        why: "No valid target given",
        cause: {},
      });
    switch (detail.type) {
      case "connected":
        this.registered.set(target, { width: 0, height: 0 });
        break;
      case "disconnected":
        this.registered.delete(target);
        break;
      case "update":
        const curr = detail.rect;
        const prev = this.registered.get(target)!;
        if (prev.width === curr.width && prev.height === curr.height) break;
        this.registered.set(target, detail.rect);
        break;
    }
    switch (detail.type) {
      case "disconnected":
      case "update":
        const geometry = this.updateGeometry(this.orderTrackedNodes());
        if (geometry)
          setTimeout(() => {
            this.emitSize(geometry);
          }, PROPAGATE_DELAY);
    }
  }

  private orderTrackedNodes() {
    const serial = this.getSizeList();
    const ordered: ComponentDims[] = [];
    for (let component of serial) {
      const dims = this.registered.get(component);
      if (!dims) {
        // FIX you may need to replace this with a boundingClientRect call
        assertNever({ why: "The element should exist in weakmap" });
      }
      ordered.push({ component, dims });
    }
    return ordered;
  }

  updateGeometry(dims: ComponentDims[]): Dims | null {
    assertNever({ why: "This method needs to be overwritten by the leaf" });
  }

  public animateStyle(
    pos: AnimateableStyles,
    options: AnimationOptions,
    whenDone?: () => void,
    assign?: Animation,
  ) {
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
    const anim = this.animate(
      {
        ...transform,
        ...(pos.width !== undefined ? { width: pos.width + "px" } : {}),
        ...(pos.height !== undefined ? { height: pos.height + "px" } : {}),
        ...(pos.opacity !== undefined ? { opacity: pos.opacity } : {}),
      },
      {
        easing: "linear",
        fill: "both",
        ...options,
      },
    );
    if (assign) assign = anim;
    anim.finished.then(() => {
      whenDone && whenDone();
    });
    return this;
  }

  setStyle(pos: AnimateableStyles) {
    this.animateStyle(pos, { duration: 0 });
    return this;
  }

  public informStyle(pos: AnimateableStyles): void {
    console.log("styleinform", this, pos);
  }
}

export class R2C extends R2CNew implements R2Animate {
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

  // public informStyle(pos: AnimateableStyles): void {
  //   console.log("styleinform", this, pos);
  // }
}
