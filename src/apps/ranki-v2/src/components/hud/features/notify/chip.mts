import { WcChip } from "_components/hud/components/chip.mjs";
import type { RankiHudStateAnimation } from "_components/hud/hud.types.mjs";
import { RText, type RTextProps } from "_components/text/text.mjs";
import { assertNever } from "_error/assertions.mjs";

export type RNotifyChipProps = {
  animation: RankiHudStateAnimation;
  type: "version" | "delta";
  text: string;
};

export class RNotifyChip extends WcChip<
  RNotifyChipProps,
  RNotifyChipProps,
  RText,
  RTextProps
> {
  static readonly tag = "r-notify-chip" as const;

  protected computePadding(curr: RNotifyChipProps) {
    let left = "0px";
    let right = "0px";
    switch (curr.type) {
      case "version":
        left = "16px";
        right = "16px";
        break;
      case "delta":
        left = "8px";
        right = "12px";
        break;
      default:
        assertNever({ why: "Unrecognized notify type", details: { curr } });
    }
    return { paddingLeft: left, paddingRight: right };
  }

  protected reconcileChildren(curr: RNotifyChipProps) {
    const state = [
      {
        type: "text",
        state: {
          animation: curr.animation,
          text: curr.text,
        },
      },
    ];
    this.subtree.reconcile(state);
  }
}
