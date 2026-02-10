import type { WrappedState } from "_components/subtree/subtree.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import { assertNever } from "_error/assertions.mjs";

const DUR = 4e2;

export class RPairItem<T> extends Wc<T> {
  isActive(): boolean {
    return true;
  }

  getKey() {
    assertNever({ why: "This method needs to be overridden" });
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    // assertNotUndefined(s, {
    //   why: "face is required",
    // });
    return this.getKey() === s.state.getKey() ? "advance" : "remove";
  }

  setProps(s: T) {
    this.state.set(s);
  }

  private computeHeight() {
    const s = getComputedStyle(this);
    const tallerThanScreen = parseFloat(s.height) > window.innerHeight;
    const endHeight = tallerThanScreen ? window.innerHeight + "px" : s.height;
    return endHeight;
  }

  initialize(): void {
    this.animation
      .pushPreset("show", () => {
        // TODO this should be a property callback
        setTimeout(() => {
          this.css.remove(["max-height"]);
        }, DUR);
        return {
          keyframes: [
            {
              opacity: 0,
              maxHeight: 0,
            },
            {
              opacity: 1,
              maxHeight: this.computeHeight(),
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
              maxHeight: this.computeHeight(),
            },
            {
              opacity: 0,
              maxHeight: 0,
            },
          ],
          options: {
            duration: DUR,
            fill: "both",
          },
        };
      });
  }
}
