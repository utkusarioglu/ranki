import styles from "./address.component.css?inline";
import type {
  HudAddressProps,
  HudAddressSegment,
} from "_components/hud/hud.types.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import { RAddressCrumb } from "./crumb.mts";
import { WcSub } from "_components/sub/sub.mjs";

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

  initialize(): void {
    this.elements.create("container", { tag: "div", classes: ["container"] });
    let items: number[] = [];
    this.animation.registerEventCallback("width", (s) => {
      items.push(parseFloat(s.width!.toString()));
      const childLength = this.subtree.getAll().length;
      if (items.length === childLength) {
        const width = items.reduce((a, c) => a + c, 0);
        console.log(width, childLength, this.subtree.getAll());
      }
    });
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
    console.log(curr);
    this.subtree.reconcile(
      curr.segments.map((state) => ({
        type: state.type,
        state,
      })),
    );
  }
}
