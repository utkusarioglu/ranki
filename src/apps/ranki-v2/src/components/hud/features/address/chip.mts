import { WcChip } from "_components/hud/components/chip.mjs";
import type { HudAddressSegment } from "_components/hud/hud.types.mjs";
import { RText } from "_components/text/text.mjs";

type T = HudAddressSegment;

export class RAddressCrumb extends WcChip<T> {
  static readonly tag = "r-address-chip";

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

  protected onStateChange(curr: HudAddressSegment): void {
    const text = this.elements.get<RText>("text")!;
    text.state.set({ text: curr.shown.join("") });
    this.className = curr.type;
  }
}
