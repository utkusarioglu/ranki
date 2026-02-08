import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import "@phosphor-icons/webcomponents";

export interface RankiIconState {
  icon: string;
  color?: string;
}

type T = RankiIconState;

const DUR = 4e2;

export class RIcon extends Wc<T> {
  public static tag = "r-icon";

  isActive(): boolean {
    const icon = this.state.curr()?.icon;
    return !!icon && (icon.length > 0 || icon !== "none");
  }

  canReconcile(): ReconciliationAction {
    return "mutate";
  }

  hasNext(b: boolean) {
    this.css.set({ "margin-right": b ? "5px" : "0" });
  }

  initialize(): void {
    this.state.setTrigger((p, c) => p?.icon !== c.icon);
    this.css.set({
      display: "block",
      // overflow: "hidden",
      // display: "inline-grid",
      // "white-space": "nowrap",
      height: "100%",
    });
    this.animation
      .registerEventCallback("width", ({ keyframe }) => ({
        keyframes: [
          {
            width: this.getBoundingClientRect().width + "px",
          },
          {
            width: keyframe.width,
          },
        ],
        options: {
          duration: DUR,
          fill: "both",
        },
      }))
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
        },
      }))
      .pushPreset("exit", () => ({
        keyframes: [
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
        ],
        options: {
          duration: DUR,
        },
      }));
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

    this.animation.triggerEvent("width", () => ({
      width: newIcon.css.getWidth() + "px",
      paddingLeft: "0px",
      paddingRight: "0px",
      marginLeft: "0px",
      marginRight: "5px", // #1
      borderLeftWidth: "0px",
      borderRightWidth: "0px",
    }));
  }
}

export class RIconBox extends Wc<T> {
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
      .pushPreset("exit", () => ({
        keyframes: [
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
        ],
        options: {
          duration: DUR,
          fill: "both",
        },
      }));
  }

  onStateChange(curr: T) {
    const icon = document.createElement(`ph-${curr.icon}`);
    icon.setAttribute("weight", "fill");
    if (curr.color) {
      icon.setAttribute("color", `rgb(var(--scheme-${curr.color}))`);
    } else {
      icon.removeAttribute("color");
    }
    this.appendChild(icon);
  }
}
