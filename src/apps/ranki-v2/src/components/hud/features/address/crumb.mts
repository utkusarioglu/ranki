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
    this.state.setTrigger((p, c) => {
      // TODO
      return c.type !== p?.type || c.shown.join("") !== p?.shown.join("");
    });
    this.elements.push("text", text);
    this.animation
      .setDependencyCallback(() => [text])
      .listenEvent("width", (endState) => {
        const c = getComputedStyle(this);
        const p = parseFloat(c.paddingLeft) + parseFloat(c.paddingRight);
        let w = this.getBoundingClientRect().width;
        let start = w - p;
        start = start < 0 ? 0 : start;
        const end = endState.width;
        console.log(start, end);
        return {
          keyframes: [
            {
              width: start + "px",
            },
            {
              width: endState.width,
            },
          ],
          options: {
            duration: 4e2,
            fill: "both",
          },
        };
      })
      .pushPreset("enter", () => ({
        keyframes: [
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      }))
      .pushPreset("exit", () => {
        const c = getComputedStyle(this);
        return {
          keyframes: [
            {
              opacity: 1,
              width: c.width,
              paddingLeft: c.paddingLeft,
              paddingRight: c.paddingRight,
            },
            {
              opacity: 0,
              width: 0,
              paddingLeft: 0,
              paddingRight: 0,
            },
          ],
          options: {
            duration: 4e2,
            fill: "both",
          },
        };
      });
    this.css.set({
      "box-sizing": "content-box",
      display: "grid",
      // height: "100%",
      // position: "fixed",
      // border: "1px solid red",
      width: 0,
      overflow: "hidden",
    });
  }

  protected onStateChange(curr: HudAddressSegment): void {
    const text = this.elements.get<RText>("text")!;
    text.state.set({ text: curr.shown.join("") });
    this.animation.raf(2, () => {
      this.className = curr.type;
    });
  }
}
