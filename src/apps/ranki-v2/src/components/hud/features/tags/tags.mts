import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type {
  HudTagListItem,
  HudTagsProps,
} from "_components/hud/hud.types.mts";
import { HudTagsTag } from "./HudTagsTag.mts";
import styles from "./tags.component.css?inline";
import { Subtree, type WrappedState } from "_components/subtree/subtree.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import { assertNotNull } from "_error/assertions.mjs";

export class HudTags extends RankiHudWc<HudTagsProps> {
  protected static name = "ranki-hud-tags" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation.collapseXFadeOut(this, {}),
  };
  private subtree = new Subtree<HudTagsTag, HudTagListItem>({
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

  canReconcile(s: WrappedState<HudTagsProps>): ReconciliationAction {
    return s.type === "tags" ? "mutate" : "remove";
  }

  // TODO
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

  isActive(): boolean {
    return !!this.getCurr().count;
  }

  private createSubtreeChild(s: WrappedState<HudTagListItem>) {
    const container = this.getContainer();
    assertNotNull(container, { why: "Creation requires container" });
    return HudTagsTag.createAndAttach<HudTagListItem, HudTagsTag>(
      s.state,
      container,
    );
  }

  private removeSubtreeChild(e: HudTagsTag) {
    e.remove();
  }

  render() {
    this.build();
    const curr = this.getCurr();
    if (curr.count > 0) {
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    this.subtree.reconcile(
      curr.list.map(({ type, text }) => ({ type, state: { type, text } })),
    );
    this.adjustWidth();
    return this;
  }
}
