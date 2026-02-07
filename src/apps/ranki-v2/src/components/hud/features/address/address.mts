import styles from "./address.component.css?inline";
import type {
  HudAddressProps,
  HudAddressSegment,
} from "_components/hud/hud.types.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import { RAddressCrumb } from "./crumb.mts";
import { WcSub } from "_components/sub/sub.mjs";

const DUR = 4e2;

export class RAddress extends Wc<HudAddressProps> {
  public static readonly tag = "ranki-hud-address" as const;
  private subtree = new WcSub<RAddressCrumb, HudAddressSegment>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  hasNext(n: boolean) {
    this.css.set({ "margin-right": n ? "1em" : 0 });
  }

  setProps(e: HudAddressProps) {
    this.state.set(e);
  }

  canReconcile(s: WrappedState<HudAddressProps>): ReconciliationAction {
    return s.type === "address" ? "mutate" : "remove";
  }

  private setWidthListener() {
    let items: number[];
    let count = 0;
    this.animation.registerEventCallback("width", ({ keyframe }) => {
      if (!count) {
        count = this.subtree.getAll().length;
        items = [];
      }
      items.push(this.css.computeTotalWidth(keyframe));
      if (items.length === count) {
        const endWidth = Array.from(items.values()).reduce((a, c) => a + c, 0);
        const c = getComputedStyle(this);
        const currWidth = parseFloat(c.width!.toString());
        console.log(endWidth, currWidth, Math.abs(endWidth - currWidth));
        if (Math.abs(endWidth - currWidth) > 1) {
          this.animation.animate("width", {
            keyframes: [
              {
                width: currWidth + "px",
              },
              {
                width: endWidth + "px",
              },
            ],
            options: {
              duration: DUR,
              fill: "both",
            },
          });
        }
        count = 0;
      }
    });
  }

  initialize(): void {
    this.elements.create("container", { tag: "div", classes: ["container"] });
    this.css.set({
      overflow: "hidden",
    });
    this.setWidthListener();
  }

  isActive(): boolean {
    return true;
  }

  private createSubtreeChild(s: WrappedState<HudAddressSegment>) {
    const container = this.elements.get("container");
    const ch = RAddressCrumb.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }

  private removeSubtreeChild(e: RAddressCrumb) {
    e.remove();
  }

  protected onStateChange(curr: HudAddressProps): void {
    this.subtree.reconcile(
      curr.segments.map((state) => ({
        type: state.type,
        state,
      })),
    );
  }
}
