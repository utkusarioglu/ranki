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
    this.css.set({
      display: "inline-block",
      position: "fixed",
      // "background-color": "red",
      border: "1px solid red",
      width: 0,
      // overflow: "hidden",
    });
    const text = RText.create.instance({ text: "" }, this);
    this.animation.setEventLibrary({
      // enter: {
      //   keyframes: [
      //     {
      //       "padding-inline": "0",
      //     },
      //     {
      //       "padding-inline": "1em",
      //     },
      //   ],
      //   options: {
      //     duration: 4e2,
      //     fill: "both",
      //   },
      // },
      exit: {
        keyframes: [
          {
            "padding-inline": "0",
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      },
    });
    this.elements.push("text", text);
  }

  protected onStateChange(curr: HudAddressSegment): void {
    const text = this.elements.get<RText>("text")!;
    text.state.set({ text: curr.shown.join("") });
    this.className = curr.type;
    this.animation.onLayout("width", {
      // name: "adjust-width",
      keyframes: [
        {
          width: this.getBoundingClientRect().width + "px",
        },
        {
          width: () => text.animation.getIntent("width")!.width,
        },
      ],
      options: {
        duration: 4e2,
        fill: "both",
      },
    });
  }
}
