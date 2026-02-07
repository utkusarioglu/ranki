import { WcChip } from "_components/hud/components/chip.mjs";
import { RText } from "_components/text/text.mjs";
import { assertNever } from "_error/assertions.mjs";

export type RNotifyChipProps = { text: string; type: "version" | "delta" };

export class RNotifyChip extends WcChip<RNotifyChipProps> {
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

  protected onStateChange(curr: RNotifyChipProps): void {
    const text = this.elements.get<RText>("text")!;
    text.state.set({ text: curr.text });
    this.className = curr.type;
  }
}
