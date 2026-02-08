import "@phosphor-icons/webcomponents";
import { WcChip } from "_components/hud/components/chip.mjs";
import { RIcon, type RankiIconState } from "_components/icon/icon.mjs";
import { WcSub, type ElemMin, type WrappedState } from "_components/wc/sub.mjs";
import { RText, type RankiTextState } from "_components/text/text.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";
import { assertNever } from "_error/assertions.mjs";

type T = ProcessedCue;

type ChildrenTypes = ElemMin<ChildrenProps>;
type ChildrenProps = RankiTextState | RankiIconState;

const DUR = 4e2;

export class WcCueChip extends WcChip<T> {
  protected subtree = new WcSub<ChildrenTypes, ChildrenProps>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  initialize(): void {
    this.setWidthListener();
    this.pushAnimationPresets();
    this.initCss();
  }

  hasNext(b: boolean) {
    this.css.set({ "margin-right": b ? "5px" : "0" });
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

  private mutateBackground(curr: T) {
    if (curr.background) {
      this.css.set({
        background: `rgb(var(--scheme-${curr.background.color}))`,
      });
    } else {
      this.css.remove(["background"]);
    }
  }

  private reconcileChildren(curr: T) {
    const state: WrappedState<ChildrenProps>[] = [];
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

    this.subtree.reconcile(state);
  }

  protected onStateChange(curr: T): void {
    this.className = curr.type;
    this.mutateBackground(curr);
    this.reconcileChildren(curr);
  }
}
