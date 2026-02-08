import type { WrappedState } from "_components/subtree/subtree.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";

const DUR = 2e3;

export class RIndicatorPattern extends Wc<string> {
  public static readonly tag = "r-indicator-pattern" as const;

  isActive(): boolean {
    return this.state.curr() !== "transparent";
  }

  setProps(s: string) {
    this.state.set(s);
  }

  canReconcile(s: WrappedState<string>): ReconciliationAction {
    return s.state === this.state.curr() ? "mutate" : "remove";
  }

  initialize() {
    this.animation
      .pushPreset("enter", () => {
        return {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          options: {
            duration: DUR,
            fill: "both",
          },
        };
      })
      .pushPreset("exit", () => {
        return {
          keyframes: [{ opacity: 1 }, { opacity: 0 }],
          options: {
            duration: DUR,
            fill: "both",
          },
        };
      });
  }

  protected onStateChange(curr: string): void {
    this.style.background = curr;
  }
}
