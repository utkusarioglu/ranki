import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import "@phosphor-icons/webcomponents";
import type { WrappedState } from "_components/subtree/subtree.mjs";

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
    } else if (!n.state.icon || n.state.icon === "none") {
      return "mutate";
      // const c = this.state.curr();
      // if (c.icon && c.icon !== "none") {
      //   return "remove";
      // } else {
      //   return "advance";
      // }
      // console.log("remove", n);
      // return "remove";
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
    this.state.setTrigger((p, c) => p?.icon !== c.icon);
    this.css.set({
      display: "block",
      // overflow: "hidden",
      // display: "inline-grid",
      // "white-space": "nowrap",
      height: "100%",
    });
    this.animation
      // .registerEventCallback("width", ({ keyframe }) => ({
      //   keyframes: [
      //     {
      //       width: this.getBoundingClientRect().width + "px",
      //     },
      //     {
      //       width: keyframe.width,
      //     },
      //   ],
      //   options: {
      //     duration: DUR,
      //     fill: "both",
      //   },
      // }))
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

  private reportWidth() {
    const elem = this.elements.get<RIconBox>("curr")!;
    this.animation.triggerEvent("width", () => ({
      ...this.css.zeroWidthProperties(),
      width: elem.css.getWidth() + "px",
      marginRight: this.marginRight, // #1
    }));
  }

  protected onStateSame(curr: RankiIconState): void {
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
    // this.animation.triggerEvent("width", () => ({
    //   ...this.css.zeroWidthProperties(),
    //   width: newIcon.css.getWidth() + "px",
    //   marginRight: this.marginRight, // #1
    // }));
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
