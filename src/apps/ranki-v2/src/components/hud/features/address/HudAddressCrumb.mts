import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import { type AnimationTypes } from "_components/animation/animation.mts";
import { RankiAnimation } from "_components/animation/animation.mts";
import type { HudAddressSegment } from "_components/hud/hud.types.mjs";
import { assertNever } from "_error/assertions.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import type {
  ReconciliationInfo,
  WrappedState,
} from "_components/subtree/subtree.mjs";

export class HudAddressCrumb extends RankiHudWc<HudAddressSegment> {
  protected static name = "hud-address-crumb" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this, {
      // setup: {
      //   // "max-width": 0,
      // },
      // initial: {
      //   width: "auto",
      //   // "max-width": "auto",
      // },
    }),
    exit: RankiAnimation.fadeOut(this),
  };

  isActive(): boolean {
    return true;
  }

  canReconcile(): ReconciliationAction {
    return "mutate";
  }

  render() {
    const s = this.getCurr();
    switch (s.mode) {
      case "trim":
      case "hide":
      case "separator":
        this.className = "divider";
        break;
      case "show":
        this.className = "segment";
        break;
      default:
        assertNever({
          why: "Unrecognized address segment mode",
          details: { curr: this.getCurr(), segment: s },
        });
    }
    this.innerText = s.shown.join("");

    return this;
  }
}
