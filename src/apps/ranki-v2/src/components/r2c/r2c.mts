import { LitElement } from "lit";
import { TimingUtils } from "_utils/timing.mjs";
import {
  assertNever,
  assertNotNull,
  assertOverride,
} from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import {
  ReconciliationUtils,
  type ReconciliationChanges,
} from "_utils/reconciliation.mjs";
import type {
  ComponentDims,
  Dims,
  DirectionalEvaluation,
  InformContext,
  InformStyle,
  InformSubtreeStyles,
  R2CNewChildSizeEvent,
  R2Sizing,
  UpdateStyle,
} from "_/controllers/geometry.types.mjs";
import { GeometryUtils } from "_/controllers/geometry.utils.mjs";
import type {
  AnimateableStyles,
  AnimationOptions,
  ImmediateStyles,
} from "_/controllers/geometry.animator.types.mjs";

export type Other = {
  opacity: number;
};

export interface R2Animate extends LitElement {
  setStyle(pos: AnimateableStyles): this;
  animateStyle(
    name: string,
    pos: AnimateableStyles,
    options: AnimationOptions,
  ): this;
  informStyle(pos: AnimateableStyles, context: InformContext): void;
}

export class R2C extends LitElement implements R2Animate {
  // OBSOLETE
  private registered = new WeakMap<R2C, Dims>();
  // OBSOLETE
  private geometry: R2Sizing | null = null;
  // OBSOLETE
  private runningAnimations = new Map<string, Animation>();
  // OBSOLETE
  private requested = false;
  // OBSOLETE
  private currStyle: UpdateStyle | null = null;

  protected emitLeave() {
    this.dispatchEvent(ReconciliationUtils.leaveEvent());
  }

  // OBSOLETE
  /**
   * @dev
   * #1 Left in for autocomplete reference
   */
  protected async updateStyle(
    // @ts-expect-error #1
    curr: InformStyle,
    // @ts-expect-error #1
    prev: InformStyle | null,
    // @ts-expect-error #1
    context?: InformContext,
  ): Promise<void> {
    assertOverride({ why: "update style needs to be defined for each leaf" });
  }

  // OBSOLETE
  protected getSizing(): R2Sizing {
    assertNotNull(this.geometry, {
      why: "getGeometry called when no geometry was registered",
    });
    return this.geometry;
  }

  // OBSOLETE
  protected getSubtreeList(): R2C[] {
    assertOverride({
      why: "getSizeList needs to be defined for all subtree consuming classes",
    });
  }

  // OBSOLETE
  protected emitSize(dims: Dims | DOMRect) {
    GeometryUtils.emitSize(this, dims);
    // this.dispatchEvent(
    //   new CustomEvent("r2-child-size", {
    //     detail: {
    //       type: "update",
    //       rect: { width, height },
    //     },
    //     bubbles: true,
    //     composed: true,
    //   }),
    // );
  }

  // OBSOLETE
  override connectedCallback(): void {
    GeometryUtils.emitConnected(this);
    // this.dispatchEvent(
    //   new CustomEvent("r2-child-size", {
    //     detail: {
    //       type: "connected",
    //     },
    //     bubbles: true,
    //     composed: true,
    //   }),
    // );
    super.connectedCallback();
  }

  // OBSOLETE
  override disconnectedCallback(): void {
    GeometryUtils.emitDisconnected(this);
    // this.dispatchEvent(
    //   new CustomEvent("r2-child-size", {
    //     detail: {
    //       type: "disconnected",
    //     },
    //     bubbles: true,
    //     composed: true,
    //   }),
    // );
    super.disconnectedCallback();
  }

  // OBSOLETE
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

  // OBSOLETE
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

  // OBSOLETE
  /**
   * @dev
   * #1 Left in for autocomplete reference
   */
  protected updateSizing(
    // @ts-expect-error #1
    dims: ComponentDims[],
  ): R2Sizing | null {
    assertNever({ why: "This method needs to be overwritten by the leaf" });
  }

  // OBSOLETE
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
        // easing: "linear",
        easing: "ease-in-out",
        // easing: "cubic-bezier(0.6, -1, 0.2, 2.4)",
        fill: "both",
        ...options,
      },
    );
    this.runningAnimations.get(name)?.commitStyles();
    this.runningAnimations.get(name)?.cancel();
    this.runningAnimations.set(name, anim);
    anim.finished
      .then(() => {
        whenDone && whenDone();
      })
      .catch(() => {});
    return this;
  }

  // OBSOLETE
  getRunningAnimation(name: string): Animation | undefined {
    return this.runningAnimations.get(name);
  }

  // OBSOLETE
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

  // OBSOLETE
  public async informStyle(
    informed: InformStyle,
    context?: InformContext,
  ): Promise<void> {
    const prev = this.currStyle;
    let sizing = {} as R2Sizing;
    try {
      sizing = this.getSizing();
    } catch (e) {}

    const evaluations = {
      main: this.evaluateChange(sizing, prev, "width"),
      cross: this.evaluateChange(sizing, prev, "height"),
    };
    const curr = { ...informed, ...sizing, ...evaluations };

    this.currStyle = curr;
    return this.updateStyle(this.currStyle, prev, context);
  }

  // OBSOLETE
  private evaluateChange(
    curr: R2Sizing,
    prev: UpdateStyle | null,
    prop: "width" | "height",
  ): DirectionalEvaluation {
    const isExpanding = curr[prop] > (prev ? prev[prop] : 0);
    const isContracting = curr.width < (prev ? prev[prop] : 0);
    const action = isExpanding ? "expand" : isContracting ? "contract" : "none";
    return {
      action,
      isExpanding,
      isContracting,
    };
  }

  // OBSOLETE
  public async informSubtreeStyles(
    curr: InformSubtreeStyles,
    changes: ReconciliationChanges,
  ): Promise<void> {
    await Promise.all(
      this.getSubtreeList().map((e, i, a) =>
        e.informStyle(
          {
            left: curr.lefts[i],
            top: curr.tops[i],
          },
          {
            index: i,
            length: a.length,
            changes,
          },
        ),
      ),
    );
  }
}
