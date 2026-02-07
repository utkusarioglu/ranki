import styles from "./address.component.css?inline";
import type {
  HudAddressSegment,
  HudAddressProps,
} from "_components/hud/hud.types.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";
import { type ReconciliationAction } from "_components/wc/wc.mjs";
import { RAddressCrumb } from "./chip.mts";
import { WcHudContainer } from "_components/hud/components/container.mjs";

type T = HudAddressProps;

export class RAddress extends WcHudContainer<
  T,
  T,
  RAddressCrumb,
  HudAddressSegment
> {
  public static readonly tag = "r-address" as const;
  // private subtree = new WcSub<RAddressCrumb, HudAddressSegment>({
  //   create: this.createSubtreeChild.bind(this),
  //   remove: this.removeSubtreeChild.bind(this),
  // });

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  // hasNext(n: boolean) {
  //   this.css.set({ "margin-right": n ? "1em" : 0 });
  // }

  // setProps(e: HudAddressProps) {
  //   this.state.set(e);
  // }

  // canReconcile(s: WrappedState<T>): ReconciliationAction {
  //   return s.type === "address" ? "mutate" : "remove";
  // }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return s.type === "address" && !!this.subtree.getAll().length
      ? "mutate"
      : "remove";
  }

  // private setWidthListener() {
  //   let items: number[];
  //   let count = 0;
  //   this.animation.registerEventCallback("width", ({ keyframe }) => {
  //     if (!count) {
  //       count = this.subtree.getAll().length;
  //       items = [];
  //     }
  //     items.push(this.css.computeTotalWidth(keyframe));
  //     if (items.length === count) {
  //       const endWidth = Array.from(items.values()).reduce((a, c) => a + c, 0);
  //       const c = getComputedStyle(this);
  //       const currWidth = parseFloat(c.width!.toString());
  //       if (Math.abs(endWidth - currWidth) > 1) {
  //         this.animation.animate("width", {
  //           keyframes: [
  //             {
  //               width: currWidth + "px",
  //             },
  //             {
  //               width: endWidth + "px",
  //             },
  //           ],
  //           options: {
  //             duration: DUR,
  //             fill: "both",
  //           },
  //         });
  //       }
  //       count = 0;
  //     }
  //   });
  // }

  // initialize(): void {
  //   this.elements.create("container", { tag: "div", classes: ["container"] });
  //   this.css.set({
  //     overflow: "hidden",
  //   });
  //   this.setWidthListener();
  // }

  // isActive(): boolean {
  //   return true;
  // }

  protected createSubtreeChild(s: WrappedState<HudAddressSegment>) {
    const container = this.elements.get("container");
    const ch = RAddressCrumb.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }

  // protected removeSubtreeChild(e: RAddressCrumb) {
  //   e.remove();
  // }

  protected onStateChange(curr: T): void {
    this.subtree.reconcile(
      curr.segments.map((state) => ({
        type: state.type,
        state,
      })),
    );
  }
}
