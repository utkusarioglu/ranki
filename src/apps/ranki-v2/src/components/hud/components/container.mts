import {
  WcSub,
  type ElemMin,
  type WrappedState,
} from "_components/sub/sub.mjs";
import { Wc } from "_components/wc/wc.mjs";
import { assertNever } from "_error/assertions.mjs";

const DUR = 4e2;

export class WcHudContainer<T, G, C extends ElemMin<K>, K> extends Wc<T, G> {
  protected subtree = new WcSub<C, K>({
    // @ts-expect-error
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  protected createSubtreeChild(
    // @ts-expect-error
    s: WrappedState<K>,
  ) {
    assertNever({ why: "This method needs to be overridden" });
  }

  protected removeSubtreeChild(e: C) {
    e.remove();
  }

  isActive(): boolean {
    return !!this.subtree.getAll().length;
  }

  hasNext(n: boolean) {
    this.css.set({ "margin-right": n ? "1em" : 0 });
  }

  setProps(e: T) {
    this.state.set(e);
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

  protected onStateSame(): void {
    this.animation.triggerEvent("width", () => {
      return this.css.selectWidthProperties(getComputedStyle(this));
    });
  }

  initialize(): void {
    this.elements.create("container", { tag: "div", classes: ["container"] });
    this.css.set({ overflow: "hidden" });
    this.setWidthListener();
  }
}
