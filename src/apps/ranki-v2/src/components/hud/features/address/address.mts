import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type {
  HudAddressProps,
  HudAddressSegment,
} from "_components/hud/hud.types.mts";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import { Subtree, type WrappedState } from "_components/subtree/subtree.mjs";
import { assertNotNull } from "_error/assertions.mts";
import styles from "./address.component.css?inline";
import { HudAddressCrumb } from "./HudAddressCrumb.mts";

export class HudAddress extends RankiHudWc<HudAddressProps> {
  protected static name = "ranki-hud-address" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation.collapseXFadeOut(this, {}),
  };
  private subtree = new Subtree<HudAddressCrumb, HudAddressSegment>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  hasNext(n: boolean) {
    this.setProperties({ "margin-right": n ? "1em" : 0 });
  }

  canReconcile(s: WrappedState<HudAddressProps>): ReconciliationAction {
    return s.type === "address" ? "mutate" : "remove";
  }

  private adjustWidth() {
    const container = this.getContainer();
    if (!container) return;
    const left = this.getLeft();
    const last = this.subtree.getLast();
    const right = last?.getRight() || left;
    this.setProperties({ width: right - left + "px" });
  }

  private build() {
    this.createSingletonContainer();
  }

  private createSubtreeChild(s: WrappedState<HudAddressSegment>) {
    const container = this.getContainer();
    assertNotNull(container, { why: "container is required" });
    return HudAddressCrumb.createAndAttach<HudAddressSegment, HudAddressCrumb>(
      s.state,
      container,
    );
  }

  private removeSubtreeChild(e: HudAddressCrumb) {
    e.remove();
  }

  isActive(): boolean {
    return true;
  }

  render() {
    const curr = this.getCurr();
    this.build();
    if (curr.count) {
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    this.subtree.reconcile(
      curr.segments.map((state) => ({
        type: state.type,
        state,
      })),
    );
    return this;
  }
}
