import { LitElement } from "lit";
import { TimingUtils } from "_utils/timing.mjs";
import { assertNever, assertNotNull } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";

export type ListenChildrenEventFunc = (e: ListenChildrenEvent) => void;

export type ListenChildrenEvent = CustomEvent<{ rect: Dims; detail: any }>;

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
  animateStyle(
    name: string,
    pos: AnimateableStyles,
    options: AnimationOptions,
  ): this;
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
  component: R2C;
  dims: Dims;
}

export type R2Geometry = {
  sizing: Dims & { lefts: number[]; tops: number[] };
  elements?: Record<string, AnimateableStyles>;
};

export class R2C extends LitElement implements R2Animate {
  private registered = new WeakMap<R2C, Dims>();
  private geometry: R2Geometry | null = null;

  private runningAnimations = new Map<string, Animation>();
  private requested = false;

  protected getGeometry(): R2Geometry {
    assertNotNull(this.geometry, {
      why: "getGeometry called when no geometry was registered",
    });
    return this.geometry;
  }

  protected getSizeList(): R2C[] {
    console.log(this, "did not define `getSizeList`");
    return [];
    // assertNever({ why: "This method needs to be defined by the leaf" });
    // return Array.from(this.shadowRoot!.children) as R2CNew[];
  }

  protected emitSize({ width, height }: Dims | DOMRect) {
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

    const target = e.composedPath()[0] as R2C;
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
        this.geometry = this.updateGeometry(this.orderTrackedNodes());
        if (this.geometry && !this.requested) {
          this.requested = true;
          TimingUtils.raf().then(() => {
            setTimeout(() => {
              this.requested = false;
              this.emitSize(this.geometry!.sizing);
            }, PROPAGATE_DELAY);
          });
        }
    }
  }

  private orderTrackedNodes() {
    const serial = this.getSizeList();
    const ordered: ComponentDims[] = [];
    for (let component of serial) {
      const dims = this.registered.get(component);
      if (!dims) {
        console.log("cannot find", component);
        continue;
        // FIX you may need to replace this with a boundingClientRect call
        // assertNever({ why: "The element should exist in weakmap" });
      }
      ordered.push({ component, dims });
    }
    return ordered;
  }

  updateGeometry(dims: ComponentDims[]): R2Geometry | null {
    assertNever({ why: "This method needs to be overwritten by the leaf" });
  }

  public animateStyle(
    name: string,
    pos: AnimateableStyles,
    options: AnimationOptions,
    whenDone?: () => void,
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
        // easing: "cubic-bezier(0.7, -1, 0.2, 2.4)",
        fill: "both",
        ...options,
      },
    );
    // this.runningAnimations.get(name)?.cancel();
    this.runningAnimations.set(name, anim);
    anim.finished
      .then(() => {
        whenDone && whenDone();
      })
      .catch(() => {});
    return this;
  }

  getRunningAnimation(name: string): Animation | undefined {
    return this.runningAnimations.get(name);
  }

  setStyle(pos: AnimateableStyles) {
    this.animateStyle("set-style", pos, { duration: 0 });
    return this;
  }

  public informStyle(pos: AnimateableStyles): void {
    console.log("styleinform", this, pos);
  }
}
