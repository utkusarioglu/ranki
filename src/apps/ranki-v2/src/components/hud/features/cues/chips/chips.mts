import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type { ProcessedCue } from "_config/config.types.mjs";
import { HudChipsChip } from "./chip.mts";
import styles from "./chips.component.css?inline";
import { assertNotNull } from "_error/assertions.mjs";
import { Subtree } from "_components/subtree/subtree.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";

interface Wrapped {
  state: ProcessedCue;
}

export class HudChips extends RankiHudWc<ProcessedCue[]> {
  protected static name = "ranki-hud-chips" as const;
  private subtree = new Subtree<HudChipsChip, ProcessedCue>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation.collapseXFadeOut(this),
  };

  constructor() {
    super(true);
    this.pushStyles(styles);
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

  private createSubtreeChild(inc: Wrapped) {
    const container = this.getContainer();
    assertNotNull(container, { why: "No container to place children in" });
    const child = HudChipsChip.create<ProcessedCue, HudChipsChip>(inc.state);
    container.appendChild(child);
    return child;
  }

  private removeSubtreeChild(e: HudChipsChip) {
    e.remove();
  }

  hasNext(b: boolean) {
    this.setProperties({ "margin-right": b ? "0.5em" : 0 });
  }

  isActive(): boolean {
    return !!this.getCurr().length;
  }

  canReconcile(): ReconciliationAction {
    return "mutate";
  }

  render() {
    const props = this.getCurr();
    this.build();
    if (props.length) {
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    this.subtree.reconcile(props.map((state) => ({ type: "chips", state })));
    return this;
  }
}
