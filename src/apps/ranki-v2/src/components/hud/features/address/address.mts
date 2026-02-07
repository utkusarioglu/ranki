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

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return s.type === "address" && !!this.subtree.getAll().length
      ? "mutate"
      : "remove";
  }

  protected createSubtreeChild(s: WrappedState<HudAddressSegment>) {
    const container = this.elements.get("container");
    const ch = RAddressCrumb.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }

  protected onStateChange(curr: T): void {
    this.subtree.reconcile(
      curr.segments.map((state) => ({
        type: state.type,
        state,
      })),
    );
  }
}
