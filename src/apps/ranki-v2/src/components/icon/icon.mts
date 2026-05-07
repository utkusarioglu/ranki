import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
// import ghostDuotone from "@phosphor-icons/core/duotone/ghost-duotone.svg?raw";
// console.log(ghostDuotone);

await import("@phosphor-icons/webcomponents");
// import "@phosphor-icons/webcomponents/icons/PhAcorn.mjs";
// import f from "@phosphor-icons/core";

// import { icons } from "@phosphor-icons/core";
// console.log(
//   icons
//     .map((a) => a.name)
//     .map(
//       (a) =>
//         `"phosphor:fill:${a}": () => import("@phosphor-icons/core/icons/fill/${a}.svg"),`,
//     )
//     .join("\n"),
// );

import type { WrappedState } from "_components/wc/sub.mjs";
// console.log("f", f);
// import type { WrappedState } from "_components/wc/sub.mjs";
// const icons = import.meta.glob(
//   /* @vite-ignore */ "@phosphor-icons/core/assets/fill/*.svg",
//   {
//     query: "?raw",
//     import: "default",
//   },
// );

// async function getIcon(name: string): Promise<string> {
//   const path = `@phosphor-icons/core/assets/${name}.svg`;

//   const loader = icons[path];
//   if (!loader) return "";

//   return (await loader()) as Promise<string>;
// }

export interface RankiIconState {
  animation: {
    enabled: boolean;
  };
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
    return this.isValidIcon(icon);
  }

  private isValidIcon(icon: string) {
    return !!icon && icon.length > 0 && icon !== "none";
  }

  canReconcile(n: WrappedState<RankiIconState>): ReconciliationAction {
    if (n.type !== "icon") {
      return "remove";
    } else {
      return "mutate";
    }
  }

  hasNext(n: boolean) {
    const curr = this.state.curr();
    const isIcon = this.isValidIcon(curr.icon);
    const m = this.css.getMarginRight();
    this.animation.animate("margin-right", {
      keyframes: [
        {
          marginRight: m,
        },
        {
          marginRight: n && isIcon ? "5px" : 0,
        },
      ],
      options: {
        duration: curr.animation.enabled ? DUR : 0,
        fill: "both",
      },
    });
  }

  initialize(): void {
    this.state.setTrigger((p, c) => p?.icon !== c.icon || p?.color !== c.color);
    this.css.set({
      display: "block",
      width: 0,
      height: "100%",
    });
    this.animation
      .pushPreset("enter", () => {
        const curr = this.state.curr();
        return {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          options: {
            duration: curr.animation.enabled ? DUR : 0,
            fill: "both",
          },
        };
      })
      .pushPreset("exit", () => {
        const curr = this.state.curr();
        return {
          keyframes: [{ opacity: 1 }, { opacity: 0 }],
          options: {
            duration: curr.animation.enabled ? DUR : 0,
            fill: "both",
          },
        };
      });
  }

  private reportWidth() {
    const elem = this.elements.get<RIconBox>("curr")!;
    this.animation.triggerEvent("width", () => {
      const currWidth = getComputedStyle(this).width;
      const elemWidth = elem.css.getWidth() + "px";
      const curr = this.state.curr();

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
          duration: curr.animation.enabled ? DUR : 0,
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
      .pushPreset("enter", () => {
        const curr = this.state.curr();
        return {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          options: {
            duration: curr.animation.enabled ? DUR : 0,
            fill: "both",
          },
        };
      })
      .pushPreset("exit", () => {
        const curr = this.state.curr();
        return {
          keyframes: [{ opacity: 1 }, { opacity: 0 }],
          options: {
            duration: curr.animation.enabled ? DUR : 0,
            fill: "both",
          },
        };
      });
  }

  async onStateChange(curr: T) {
    // const icon = document.createElement("span");
    // const catalog = (await import("./ph.mjs")).default;
    // await catalog[`phosphor:fill:acorn`]();
    // const icon = document.createElement(`ph-${curr.icon}`);
    const icon = document.createElement(`ph-${curr.icon}`);
    // catalog[`phosphor:fill:${curr.icon}`]().then(
    // getIcon(curr.icon).then((i) => (icon.innerHTML = i));
    icon.setAttribute("weight", "fill");
    this.appendChild(icon);
    icon.style.setProperty("aspect-ratio", "1/1");

    // await Timing.waitLayout();
    if (curr.color) {
      icon.setAttribute("color", `rgb(var(--scheme-${curr.color}))`);
    } else {
      icon.removeAttribute("color");
    }
  }
}
