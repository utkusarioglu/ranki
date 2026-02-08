import { WcChip } from "_components/hud/components/chip.mjs";
import type { HudAddressSegment } from "_components/hud/hud.types.mjs";
import { RText, type RTextProps } from "_components/text/text.mjs";

type T = HudAddressSegment;

export class RAddressSegment extends WcChip<T, T, RText, RTextProps> {
  static readonly tag = "r-address-segment";

  protected computePadding(curr: T) {
    let left = "0px";
    let right = "0px";
    switch (curr.type) {
      case "divider":
        switch (curr.position.left) {
          case "first":
            left = "8px";
            break;
          case "local-first":
            left = "3px";
            break;
        }
        switch (curr.position.right) {
          case "last":
            right = "8px";
            break;
          case "local-last":
            right = "3px";
            break;
        }
        break;
      default:
        left = "16px";
        right = "16px";
    }
    return { paddingLeft: left, paddingRight: right };
  }

  initialize(): void {
    super.initialize();
    this.state.setTrigger((p, c) => {
      // TODO
      return c.type !== p?.type || c.shown.join("") !== p?.shown.join("");
    });
  }

  protected reconcileChildren(curr: HudAddressSegment) {
    const state = [
      {
        type: "text",
        state: { text: curr.shown.join("") },
      },
    ];
    this.subtree.reconcile(state);
  }

  // protected onStateChange(curr: HudAddressSegment): void {
  //   this.className = curr.type;
  //   this.reconcileChildren(curr);
  // }
}
