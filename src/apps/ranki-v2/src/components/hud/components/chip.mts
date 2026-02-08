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

  protected pushAnimationPresets() {
    this.animation
      .pushPreset("enter", () => {
        const curr = this.state.curr();
        return {
          keyframes: [
            {
              opacity: 0,
              ...this.css.zeroWidthProperties(),
            },
            {
              opacity: 1,
              ...this.computePadding(
                // @ts-expect-error
                curr,
              ),
            },
          ],
          options: {
            duration: DUR,
            fill: "both",
          },
        };
      })
      .pushPreset("exit", () => {
        return {
          keyframes: [
            {
              opacity: 1,
              ...this.css.selectWidthProperties(getComputedStyle(this)),
            },
            {
              opacity: 0,
              ...this.css.zeroWidthProperties(),
            },
          ],
          options: {
            duration: DUR,
            fill: "both",
          },
        };
      });
  }

  initialize(): void {
    const text = RText.create.instance(null, this);
    this.elements.push("text", text);
    this.pushAnimationPresets();
    this.animation
      .pushDependency("width", text)
      .registerEventCallback("width", ({ keyframe }) => {
        const curr = this.state.curr();
        const c = getComputedStyle(this);
        const p = parseFloat(c.paddingLeft) + parseFloat(c.paddingRight);
        let w = this.getBoundingClientRect().width;
        let start = w - p;
        start = start < 0 ? 0 : start;

        const widthProps = this.css.selectWidthProperties(c);
        return {
          keyframes: [
            {
              ...widthProps,
              width: start + "px",
            },
            {
              ...widthProps,
              ...this.computePadding(
                // @ts-expect-error
                curr,
              ),
              width: keyframe.width,
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
