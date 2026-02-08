import "@phosphor-icons/webcomponents";
import { WcChip } from "_components/hud/components/chip.mjs";
import { RIcon, type RankiIconState } from "_components/icon/icon.mjs";
import {
  WcSub,
  type ElemMin,
  type WrappedState,
} from "_components/sub/sub.mjs";
import { RText, type RankiTextState } from "_components/text/text.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";
import { assertNever } from "_error/assertions.mjs";

type T = ProcessedCue;

type ChildrenTypes = ElemMin<ChildrenProps>;
type ChildrenProps = RankiTextState | RankiIconState;

const DUR = 4e2;

export class WcCueChip extends WcChip<T> {
  // static readonly tag = "r-cue-label";
  protected subtree = new WcSub<ChildrenTypes, ChildrenProps>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  initialize(): void {
    this.setWidthListener();
    this.animation
      .pushPreset("enter", () => {
        const curr = this.state.curr();
        return {
          keyframes: [
            {
              opacity: 0,
              paddingLeft: 0,
              paddingRight: 0,
            },
            {
              opacity: 1,
              ...this.computePadding(curr),
            },
          ],
          options: {
            duration: DUR,
            fill: "both",
          },
        };
      })
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

  hasNext(b: boolean) {
    this.css.set({ "margin-right": b ? "0.3em" : "0" });
  }

  protected createSubtreeChild(s: WrappedState<ChildrenProps>) {
    switch (s.type) {
      case "text":
        const te = RText.create.instance(s.state, this);
        this.animation.pushDependency("width", te);
        return te;
      case "icon":
        const ie = RIcon.create.instance(s.state, this);
        this.animation.pushDependency("width", ie);
        return ie;
      default:
        assertNever({ why: "Unrecognized child type for label" });
    }
  }

  protected removeSubtreeChild(e: ChildrenTypes) {
    e.remove();
  }

  protected setWidthListener() {
    let items: number[];
    let count = 0;
    this.animation.registerEventCallback("width", ({ keyframe }) => {
      if (!count) {
        count = this.subtree.getAll().length;
        items = [];
      }
      items.push(this.css.computeTotalWidth(keyframe));
      if (items.length === count) {
        const endWidth = Array.from(items.values()).reduce((a, c) => a + c, 0);
        const c = getComputedStyle(this);
        const currWidth = parseFloat(c.width!.toString());
        if (Math.abs(endWidth - currWidth) > 1) {
          this.animation.animate("width", {
            keyframes: [
              {
                width: currWidth + "px",
              },
              {
                width: endWidth + "px",
              },
            ],
            options: {
              duration: DUR,
              fill: "both",
            },
          });
        }
        count = 0;
      }
    });
  }

  protected onStateChange(curr: T): void {
    const state: WrappedState<ChildrenProps>[] = [];

    console.log(curr);

    if (curr.background) {
      this.css.set({
        background: `rgb(var(--scheme-${curr.background.color}))`,
      });
    } else {
      this.css.remove(["background"]);
    }

    if (curr.icon) {
      state.push({
        type: "icon",
        state: {
          icon: curr.icon.id,
          color: curr.icon.color,
        },
      });
    }

    state.push({
      type: "text",
      state: curr.message ? curr.message : { text: "" },
    });

    this.className = curr.type;
    this.subtree.reconcile(state);
  }
}
