import { RText } from "_components/text/text.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";

const DUR = 5e2;

export interface MinChipProp {
  type: string;
}

export class WcChip<T extends MinChipProp, G = T> extends Wc<T, G> {
  isActive(): boolean {
    return true;
  }

  canReconcile(): ReconciliationAction {
    return "mutate";
  }

  setProps(a: T) {
    this.state.set(a);
  }

  protected computePadding(
    // @ts-expect-error
    curr: T,
  ) {
    return { paddingLeft: "16px", paddingRight: "16px" };
  }

  initialize(): void {
    const text = RText.create.instance(null, this);
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
              borderLeftWidth: c.borderLeftWidth,
              borderRightWidth: c.borderRightWidth,
              marginRight: c.marginRight,
              marginLeft: c.marginLeft,
            },
            {
              width: keyframe.width,
              borderLeftWidth: c.borderLeftWidth,
              borderRightWidth: c.borderRightWidth,
              marginRight: c.marginRight,
              marginLeft: c.marginLeft,
              // @ts-expect-error
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
              borderLeftWidth: c.borderLeftWidth,
              borderRightWidth: c.borderRightWidth,
              marginLeft: c.marginLeft,
              marginRight: c.marginRight,
            },
            {
              opacity: 0,
              width: 0,
              paddingLeft: 0,
              paddingRight: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              marginLeft: 0,
              marginRight: 0,
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
      "grid-template-columns": "max-content max-content",
      width: 0,
      overflow: "hidden",
    });
  }

  protected onStateSame(): void {
    this.animation.triggerEvent("width", () => {
      return this.css.selectWidthProperties(getComputedStyle(this));
    });
  }
}
