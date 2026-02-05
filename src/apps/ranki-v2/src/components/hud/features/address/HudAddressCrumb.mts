import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import { type AnimationTypes } from "_components/animation/animation.mts";
import { RankiAnimation_OLD } from "_components/animation/animation.mts";
import type { HudAddressSegment } from "_components/hud/hud.types.mjs";
// import { assertNever } from "_error/assertions.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import { RText } from "_components/text/text.mjs";

export class HudAddressCrumb extends RankiHudWc<HudAddressSegment> {
  protected static name = "hud-address-crumb" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation_OLD.fadeIn(this, {}),
    exit: RankiAnimation_OLD.fadeOut(this),
  };
  private text!: RText;

  isActive(): boolean {
    return true;
  }

  canReconcile(): ReconciliationAction {
    return "mutate";
  }

  private build() {
    if (this.initialized) return;
    this.initialized = true;
    this.text = RText.create.instance({ text: "" }, this);
  }

  render() {
    this.build();
    const s = this.getCurr();
    this.className = s.type;
    this.text.state.set({
      text: s.shown.join(""),
      // animation: { duration: 1e2 },
    });
  }
}
