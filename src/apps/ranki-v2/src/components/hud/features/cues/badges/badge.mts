import { WcCueChip } from "_components/hud/components/cue-chip.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";

export class RCueBadge extends WcCueChip {
  static readonly tag = "r-cue-badge";

  hasNext(): void {}

  initialize(): void {
    super.initialize();
    this.css.set({
      "max-width": "14px",
    });
  }

  protected computePadding(curr: ProcessedCue): {
    paddingLeft: string;
    paddingRight: string;
  } {
    return {
      paddingLeft: "8px",
      paddingRight: "8px",
    };
  }
}
