import {
  RankiAnimation_OLD,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type { ProcessedCue } from "_config/config.types.mjs";
import { HudLabelsLabel } from "./label_OLD.mts";
import styles from "./labels.component.css?inline";
import { Subtree } from "_components/subtree/subtree.mjs";
import { assertNotNull } from "_error/assertions.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import type { RCueLabel } from "./label.mts";

interface Wrapped {
  type: "label";
  state: ProcessedCue;
}

export class HudLabels extends RankiHudWc<ProcessedCue[]> {
  protected static name = "ranki-hud-labels" as const;
  private subtree = new Subtree<RCueLabel, ProcessedCue>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });
  protected animations: AnimationTypes = {
    show: RankiAnimation_OLD.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation_OLD.collapseXFadeOut(this),
  };

  // DONE
  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  // DONE
  private adjustWidth() {
    const container = this.getContainer();
    if (!container) return;
    const left = this.getLeft();
    const last = this.subtree.getLast();
    const right = last?.getRight() || left;
    this.setProperties({ width: right - left + "px" });
  }

  // DONE
  private build() {
    this.createSingletonContainer();
  }

  private createSubtreeChild(inc: Wrapped) {
    const container = this.getContainer();
    assertNotNull(container, { why: "No container to place children in" });
    const child = HudLabelsLabel.create<ProcessedCue, HudLabelsLabel>(
      inc.state,
    );
    container.appendChild(child);
    return child;
  }

  // DONE
  private removeSubtreeChild(e: HudLabelsLabel) {
    e.remove();
  }

  // DONE
  hasNext(b: boolean) {
    this.setProperties({ "margin-right": b ? "0.5em" : 0 });
  }

  // DONE
  isActive(): boolean {
    return !!this.getCurr().length;
  }

  // DONE
  canReconcile(p: { type: string }): ReconciliationAction {
    return p.type === "labels" ? "mutate" : "remove";
  }

  render() {
    const props = this.getCurr();
    this.build();
    if (props.length) {
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    this.subtree.reconcile(props.map((state) => ({ type: "label", state })));
    return this;
  }
}
