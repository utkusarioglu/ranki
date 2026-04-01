import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import "@phosphor-icons/webcomponents";
import { Timing } from "_utils/timing.mjs";
import type { WrappedState } from "_components/wc/sub.mjs";

export interface RankiIconState {
  icon: string;
  color?: string;
}

type T = RankiIconState;

const DUR = 4e2;

export class RIcon extends Wc<T> {
  public static tag = "r-icon";
  private marginRight = "0px";

  isActive(): boolean {
    const icon = this.state.curr()?.icon;
    return !!icon && (icon.length > 0 || icon !== "none");
  }

  canReconcile(n: WrappedState<RankiIconState>): ReconciliationAction {
    if (n.type !== "icon") {
      return "remove";
    } else {
      return "mutate";
    }
  }

  hasNext(b: boolean) {
    const s = this.state.curr();
    this.marginRight = b && s.icon && s.icon !== "none" ? "5px" : "0px";
    this.css.set({ "margin-right": this.marginRight });
  }

  initialize(): void {
    this.state.setTrigger((p, c) => p?.icon !== c.icon || p?.color !== c.color);
    this.css.set({
      display: "block",
      width: 0,
      height: "100%",
    });
    this.animation
      .pushPreset("enter", () => ({
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: {
          duration: DUR,
          fill: "both",
        },
      }))
      .pushPreset("exit", () => ({
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        options: {
          duration: DUR,
          fill: "both",
        },
      }));
  }

  private reportWidth() {
    const elem = this.elements.get<RIconBox>("curr")!;
    this.animation.triggerEvent("width", () => {
      const currWidth = getComputedStyle(this).width;
      const elemWidth = elem.css.getWidth() + "px";

      this.animation.animate("own-width", {
        keyframes: [
          {
            width: currWidth,
          },
          {
            width: elemWidth,
          },
        ],
        options: {
          duration: DUR,
          fill: "both",
        },
      });

      return {
        ...this.css.zeroWidthProperties(),
        width: elemWidth,
        marginRight: this.marginRight, // #1
      };
    });
  }

  protected onStateSame(): void {
    this.reportWidth();
  }

  /**
   * This is done because hasNext value is not available here unless it's saved in a class variable.
   * the state given to the component from the start should include these details
   */
  async onStateChange(curr: T) {
    this.elements.move("curr", "prev");
    const newIcon = RIconBox.create.instance(curr, this);
    this.elements.push("curr", newIcon);
    this.animation.pushDependency("width", newIcon);
    this.elements.remove("prev");

    this.reportWidth();
  }
}

class RIconBox extends Wc<T> {
  public static tag = "r-icon-box";

  initialize() {
    this.css.set({
      "grid-area": "1/1",
      width: "max-content",
      height: "100%",
      display: "grid",
      "justify-content": "center",
      "align-items": "center",
    });
    this.animation
      .pushPreset("enter", () => ({
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: {
          duration: DUR,
          fill: "both",
        },
      }))
      .pushPreset("exit", () => ({
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        options: {
          duration: DUR,
          fill: "both",
        },
      }));
  }

  async onStateChange(curr: T) {
    const icon = document.createElement(`ph-${curr.icon}`);
    icon.setAttribute("weight", "fill");
    this.appendChild(icon);

    // await Timing.waitLayout();
    if (curr.color) {
      icon.setAttribute("color", `rgb(var(--scheme-${curr.color}))`);
    } else {
      icon.removeAttribute("color");
    }
  }
}
