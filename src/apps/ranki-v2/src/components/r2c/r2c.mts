import { LitElement } from "lit";
import { TimingUtils } from "_utils/timing.mjs";
import { assertNever, assertNotNull } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { ReconciliationChanges } from "_utils/reconcilliation.mjs";

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

export type ImmediateStyles = { zIndex?: number } & AnimateableStyles;

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

type InformStyle = {
  context: {
    index: number;
    length: number;
    changes: ReconciliationChanges;
  };
} & Pos &
  Partial<Dims>;

export type UpdateStyle = InformStyle & R2Sizing;

export interface ComponentDims {
  component: R2C;
  dims: Dims;
}
type LeftsTops = { lefts: number[]; tops: number[] };

export type R2Sizing = Dims & LeftsTops;

type InformSubtreeStyles = LeftsTops;

export class R2C extends LitElement implements R2Animate {
  private registered = new WeakMap<R2C, Dims>();
  private geometry: R2Sizing | null = null;

  private runningAnimations = new Map<string, Animation>();
  private requested = false;
  private currStyle: UpdateStyle | null = null;

  protected getSizing(): R2Sizing {
    assertNotNull(this.geometry, {
      why: "getGeometry called when no geometry was registered",
    });
    return this.geometry;
  }

  protected getSubtreeList(): R2C[] {
    console.log(this, "did not define `getSizeList`");
    return [];
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

  override connectedCallback(): void {
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

  override disconnectedCallback(): void {
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
        this.registered.set(target, detail.rect);
        break;
    }
    switch (detail.type) {
      case "disconnected":
      case "update":
        this.geometry = this.updateSizing(this.orderTrackedNodes());
        if (!this.requested) {
          this.requested = true;
          TimingUtils.raf().then(() => {
            setTimeout(() => {
              this.requested = false;
              if (this.geometry) this.emitSize(this.geometry);
            }, PROPAGATE_DELAY);
          });
        }
    }
  }

  private orderTrackedNodes() {
    const serial = this.getSubtreeList();
    const ordered: ComponentDims[] = [];
    for (let component of serial) {
      const dims = this.registered.get(component);
      if (!dims) {
        // console.log("cannot find", component);
        continue;
        // FIX you may need to replace this with a boundingClientRect call
        // assertNever({ why: "The element should exist in weakmap" });
      }
      ordered.push({ component, dims });
    }
    return ordered;
  }

  protected updateSizing(dims: ComponentDims[]): R2Sizing | null {
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
        // easing: "ease-in-out",
        // easing: "cubic-bezier(0.6, -1, 0.2, 2.4)",
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

  setStyle({ width, height, opacity, left, top, zIndex }: ImmediateStyles) {
    this.style.setProperty("z-index", "" + zIndex);
    this.animateStyle(
      "set-style",
      {
        width,
        height,
        opacity,
        left,
        top,
      },
      { duration: 0 },
    );
    return this;
  }

  protected async updateStyle(
    curr: InformStyle,
    prev: InformStyle | null,
  ): Promise<void> {
    console.log("styleinform", this, curr, prev);
  }

  public informStyle(informed: InformStyle): void {
    const prev = this.currStyle;
    let sizing = {} as R2Sizing;
    try {
      sizing = this.getSizing();
    } catch (e) {}

    const curr = { ...informed, ...sizing };
    this.currStyle = curr;
    this.updateStyle(this.currStyle, prev);
  }

  public informSubtreeStyles(
    curr: InformSubtreeStyles,
    changes: ReconciliationChanges,
  ) {
    this.getSubtreeList().forEach((e, i, a) =>
      e.informStyle({
        context: {
          index: i,
          length: a.length,
          changes,
        },
        left: curr.lefts[i],
        top: curr.tops[i],
      }),
    );
  }
}
