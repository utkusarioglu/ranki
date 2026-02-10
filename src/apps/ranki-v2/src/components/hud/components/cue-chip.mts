import "@phosphor-icons/webcomponents";
import { WcChip } from "_components/hud/components/chip.mjs";
import { RIcon, type RankiIconState } from "_components/icon/icon.mjs";
import { WcSub, type ElemMin, type WrappedState } from "_components/wc/sub.mjs";
import { RText, type RTextProps } from "_components/text/text.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";
import { assertNever } from "_error/assertions.mjs";
import { Timing } from "_utils/timing.mjs";

type T = ProcessedCue;

type ChildrenTypes = ElemMin<ChildrenProps>;
type ChildrenProps = RTextProps | RankiIconState;

export class WcCueChip extends WcChip<T, T, ChildrenTypes, ChildrenProps> {
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

  protected async mutateBackground(curr: T) {
    await Timing.waitLayout();
    if (curr.background) {
      this.css.set({
        background: `rgb(var(--scheme-${curr.background.color}))`,
      });
    } else {
      this.css.remove(["background"]);
    }
  }

  protected reconcileChildren(curr: T) {
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
}
