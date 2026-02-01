import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type { ProcessedCue } from "_config/config.types.mjs";
import { HudChipsChip } from "./chip.mts";
import styles from "./chips.component.css?inline";
import { assertNever, assertNotNull } from "_error/assertions.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";

export class HudChips extends RankiHudWc<ProcessedCue[]> {
  protected static name = "ranki-hud-chips" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
      setup: {
        "margin-left": 0,
      },
      initial: {
        "margin-left": "0.5em",
      },
    }),
    hide: RankiAnimation.collapseXFadeOut(this, {
      setup: {
        "margin-left": "0.5em",
      },
      initial: {
        "margin-left": 0,
      },
    }),
  };
  private subtree: (HudChipsChip | null)[] = [];

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private adjustWidth() {
    const container = this.getContainer();
    if (!container) {
      return;
    }
    const last = this.subtree.at(-1);
    if (!last) {
      return;
    }

    const right = last.getRight();
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  private reconcile() {
    const container = this.getContainer();
    assertNotNull(container, {
      why: "Component needs to be built before reconciliation",
    });
    const curr = this.getCurr();
    let ii = 0; // incoming items index;
    let ci = 0; // active items index;
    const working = this.subtree;
    while (ii < curr.length || ci < this.subtree.length) {
      let action: ReconciliationAction;
      const active = working[ci];
      const inc = curr[ii];
      assertNotNull(active, {
        why: "Active element being null means filtering is broken",
      });
      if (!active && inc) {
        action = "create";
      } else if (active && !inc) {
        action = "remove";
      } else {
        action = active.canReconcile(inc);
      }

      switch (action) {
        case "remove":
          active.remove();
          this.subtree[ci] = null;
          ci++;
          break;
        case "mutate":
          active.setProps(inc);
          ci++;
          ii++;
          break;
        case "create":
          const elem = this.createChild(inc);
          working.push(elem);
          container.appendChild(elem);
          ci++;
          ii++;
          break;
        default:
          assertNever({ why: "Unrecognized action", details: { action } });
      }
    }
    this.subtree = working.filter((v) => v !== null);
  }

  private build() {
    this.createSingletonContainer();
  }

  private createChild(inc: ProcessedCue) {
    return HudChipsChip.create<ProcessedCue, HudChipsChip>(inc);
  }

  render() {
    const props = this.getCurr();
    if (props.length) {
      this.build();
      this.reconcile();
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    return this;
  }
}
