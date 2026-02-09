import { RIcon } from "_components/icon/icon.mjs";
import type { ReconciliationInfo } from "_components/subtree/subtree.mjs";
import { RText } from "_components/text/text.mjs";
import { WcSub, type ElemMin, type WrappedState } from "_components/wc/sub.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import { assertNever } from "_error/assertions.mjs";

const DUR = 4e2;

export interface MinChipProp {
  type: string;
}

export class WcChip<
  T extends MinChipProp,
  G,
  C extends ElemMin<P>,
  P,
> extends Wc<T, G> {
  protected subtree = new WcSub<C, P>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  protected createSubtreeChild(s: WrappedState<P>) {
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

  protected removeSubtreeChild(e: C) {
    e.remove();
  }

  isActive(): boolean {
    return true;
  }

  canReconcile(
    // @ts-expect-error
    s: WrappedState<T>,
    // @ts-expect-error
    info: ReconciliationInfo<T>,
  ): ReconciliationAction {
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

  protected setWidthListener() {
    let items: number[];
    let count = 0;
    this.animation.registerEventCallback("width", ({ keyframe }) => {
      if (!count) {
        count = this.subtree.getAll().length;
        items = [];
      }
      const curr = this.state.curr();
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
                paddingLeft: c.paddingLeft,
                paddingRight: c.paddingRight,
                // marginLeft: c.marginLeft,
                // marginRight: c.marginRight,
                borderLeftWidth: c.borderLeftWidth,
                borderRightWidth: c.borderRightWidth,
              },
              {
                width: endWidth + "px",
                // marginLeft: c.marginLeft,
                // marginRight: c.marginRight,
                borderLeftWidth: c.borderLeftWidth,
                borderRightWidth: c.borderRightWidth,
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
          });
        }
        count = 0;
      }
    });
  }

  initialize(): void {
    this.pushAnimationPresets();
    this.setWidthListener();
    this.initCss();
  }

  protected initCss() {
    this.css.set({
      "box-sizing": "content-box",
      display: "flex",
      width: 0,
      overflow: "hidden",
      height: "100%",
      "align-items": "center",
    });
  }

  protected mutateBackground(_curr: any) {}
  protected reconcileChildren(_curr: any) {}

  // @ts-expect-error
  protected onStateChange(curr: T): void {
    this.className = curr.type;
    this.mutateBackground(curr);
    this.reconcileChildren(curr);
  }
}
