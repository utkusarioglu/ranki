import type { HudAddressSegment } from "_components/hud/hud.types.mjs";
import { RText } from "_components/text/text.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";

export class RAddressCrumb extends Wc<HudAddressSegment> {
  static readonly tag = "r-address-crumb";

  isActive(): boolean {
    return true;
  }

  canReconcile(): ReconciliationAction {
    return "mutate";
  }

  // REMOVE
  setProps(a: any) {
    this.state.set(a);
  }

  initialize(): void {
    const text = RText.create.instance(null, this);
    this.elements.push("text", text);
    this.animation
      .setDependencyCallback(() => [text])
      .listenEvent("width", (endState) => ({
        keyframes: [
          {
            width: this.getBoundingClientRect().width + "px",
          },
          {
            width: endState.width,
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      }))
      .pushPreset("enter", () => ({
        keyframes: [
          {
            "padding-inline": "1",
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      }))
      .pushPreset("exit", () => ({
        keyframes: [
          {},
          {
            "padding-inline": "0",
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      }));
    this.css.set({
      display: "inline-block",
      position: "fixed",
      border: "1px solid red",
      width: 0,
      overflow: "hidden",
    });
  }

  protected onStateChange(curr: HudAddressSegment): void {
    const text = this.elements.get<RText>("text")!;
    text.state.set({ text: curr.shown.join("") });
    this.className = curr.type;
  }
}
