import type { HudAddressSegment } from "_components/hud/hud.types.mjs";
import { RText } from "_components/text/text.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";

const DUR = 5e2;

export class RAddressCrumb extends Wc<HudAddressSegment> {
  static readonly tag = "r-address-crumb";

  isActive(): boolean {
    return true;
  }

  canReconcile(): ReconciliationAction {
    return "mutate";
  }

  setProps(a: HudAddressSegment) {
    this.state.set(a);
  }

  private computePadding(curr: HudAddressSegment) {
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
    const text = RText.create.instance(null, this);
    this.state.setTrigger((p, c) => {
      // TODO
      return c.type !== p?.type || c.shown.join("") !== p?.shown.join("");
    });
    this.elements.push("text", text);
    this.animation
      .pushDependency("width", text)
      .registerEventCallback("width", ({ keyframe }) => {
        const curr = this.state.curr();
        const c = getComputedStyle(this);
        const p = parseFloat(c.paddingLeft) + parseFloat(c.paddingRight);
        let w = this.getBoundingClientRect().width;
        let start = w - p;
        start = start < 0 ? 0 : start;
        return {
          keyframes: [
            {
              width: start + "px",
              paddingLeft: c.paddingLeft,
              paddingRight: c.paddingRight,
              borderLeft: c.borderLeft,
              borderRight: c.borderRight,
            },
            {
              width: keyframe.width,
              borderLeft: c.borderLeft,
              borderRight: c.borderRight,
              ...this.computePadding(curr),
            },
          ],
          options: {
            duration: DUR,
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
          duration: DUR,
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
            duration: DUR,
            fill: "both",
          },
        };
      });
    this.css.set({
      "box-sizing": "content-box",
      display: "grid",
      width: 0,
      overflow: "hidden",
    });
  }

  protected onStateSame(): void {
    this.animation.triggerEvent("width", () => {
      return this.css.selectWidthProperties(getComputedStyle(this));
    });
  }

  protected onStateChange(curr: HudAddressSegment): void {
    const text = this.elements.get<RText>("text")!;
    text.state.set({ text: curr.shown.join("") });
    this.className = curr.type;
  }
}
