import { WcCueChip } from "_components/hud/components/cue-chip.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";

export class RCueBadge extends WcCueChip {
  static readonly tag = "r-cue-badge";

  hasNext(): void {}

  /**
   * @dev
   * #1 Prevents inline-flex width limits from producing a phantom margin on
   * the right side of the icon box.
   */
  initialize(): void {
    super.initialize();
    this.css.set({
      // #1
      "max-width": "14px",
    });
  }

  protected computePadding(_curr: ProcessedCue): {
    paddingLeft: string;
    paddingRight: string;
  } {
    return {
      paddingLeft: "12px",
      paddingRight: "12px",
    };
  }
}
